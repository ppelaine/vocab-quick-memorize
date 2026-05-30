import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useApp } from '@/context/AppContext'
import useGame from '@/hooks/useGame'
import useTextbooks from '@/hooks/useTextbooks'
import Confetti from './Confetti'

const SCOPES = [
  { key: 'all', label: '全部' },
  { key: 'today', label: '今天' },
  { key: '3days', label: '3天内' },
  { key: '7days', label: '7天内' },
  { key: '30days', label: '30天内' },
]

const GAME_MODES = [
  { mode: 1, icon: '🔤', label: '看英文 选中文', desc: '给出英文，找正确翻译' },
  { mode: 2, icon: '📖', label: '看释义 选单词', desc: '给出释义，找对应单词' },
  { mode: 3, icon: '✏️', label: '补全元音字母', desc: '缺了 a e i o u，填完整' },
]

export default function GameView() {
  const { toast } = useApp()
  const game = useGame()
  const textbooks = useTextbooks()
  const fillInputRef = useRef(null)
  const [fillAnswer, setFillAnswer] = useState('')
  const [fillResult, setFillResult] = useState(null)
  const [scoreDisplay, setScoreDisplay] = useState(0)
  const scoreAnimRef = useRef(null)
  const [scopeType, setScopeType] = useState('time') // 'time' or 'textbook'
  const [selectedTbIdx, setSelectedTbIdx] = useState(null)
  const [selectedUnitIdxs, setSelectedUnitIdxs] = useState([])

  // Score counter animation
  useEffect(() => {
    if (game.phase === 'result' && game.scorePct > 0) {
      setScoreDisplay(0)
      const startTime = performance.now()
      const target = game.scorePct
      const duration = 800
      const tick = (now) => {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setScoreDisplay(Math.round(eased * target))
        if (progress < 1) scoreAnimRef.current = requestAnimationFrame(tick)
      }
      scoreAnimRef.current = requestAnimationFrame(tick)
      return () => { if (scoreAnimRef.current) cancelAnimationFrame(scoreAnimRef.current) }
    }
  }, [game.phase, game.scorePct])

  // Reset fillAnswer when question changes
  useEffect(() => {
    setFillAnswer('')
    setFillResult(null)
    if (game.mode === 3 && game.phase === 'play') {
      setTimeout(() => fillInputRef.current?.focus(), 150)
    }
  }, [game.current, game.mode, game.phase])

  const showConfetti = game.phase === 'result' && game.scorePct >= 90

  const handleStart = (mode) => {
    let scopeConfig = { type: scopeType }
    if (scopeType === 'time') {
      scopeConfig.timeScope = game.scope
    } else {
      scopeConfig.tbIdx = selectedTbIdx
      scopeConfig.unitIdxs = selectedUnitIdxs
    }
    const result = game.startGame(mode, scopeConfig)
    if (result === 'not_enough') {
      toast('当前范围内词汇不足4个，请扩大范围或先导入更多单词', 'error')
    }
  }

  const toggleUnitSelection = (unitIdx) => {
    setSelectedUnitIdxs(prev => {
      if (prev.includes(unitIdx)) {
        return prev.filter(i => i !== unitIdx)
      }
      return [...prev, unitIdx]
    })
  }

  const handleOptionClick = (selectedEn) => {
    if (game.selectedAnswer) return
    const correctEn = game.currentWord.en
    game.processAnswer(selectedEn === correctEn, correctEn)
    setTimeout(() => game.nextQuestion(), 800)
  }

  const handleFillSubmit = () => {
    if (!fillAnswer.trim() || game.selectedAnswer) return
    const correctEn = game.currentWord.en
    const isCorrect = fillAnswer.trim().toLowerCase() === correctEn.toLowerCase()
    game.processAnswer(isCorrect, correctEn)
    setFillResult(isCorrect ? 'correct' : 'wrong')
    setTimeout(() => game.nextQuestion(), 1000)
  }

  const handleFillKeyDown = (e) => {
    if (e.key === 'Enter') handleFillSubmit()
  }

  return (
    <div className="animate-fade-in">
      <Confetti active={showConfetti} />

      {/* ---- Setup ---- */}
      {game.phase === 'setup' && (
        <Card>
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-extrabold mb-3 flex items-center justify-center gap-2">🎮 选择游戏模式</h2>
            <p className="text-sm text-[#9a948c] mb-6">每局20题 · 基于艾宾浩斯曲线出题 · 错词自动收录</p>

            {/* Scope Type Toggle */}
            <div className="flex gap-2 justify-center mb-4">
              <button
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                  scopeType === 'time'
                    ? 'bg-[#ff7b5c] text-white shadow-md'
                    : 'bg-white border-2 border-[#e0d8c0] text-[#9a948c] hover:border-[#ff7b5c]'
                }`}
                onClick={() => setScopeType('time')}
              >
                ⏰ 按时间选择
              </button>
              <button
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                  scopeType === 'textbook'
                    ? 'bg-[#8b6fc0] text-white shadow-md'
                    : 'bg-white border-2 border-[#e0d8c0] text-[#9a948c] hover:border-[#8b6fc0]'
                }`}
                onClick={() => setScopeType('textbook')}
              >
                📚 按教材单元
              </button>
            </div>

            {/* Time-based scope selection */}
            {scopeType === 'time' && (
              <div className="flex gap-1.5 flex-wrap justify-center mb-6">
                <span className="text-sm text-[#9a948c] self-center">词汇范围：</span>
                {SCOPES.map(s => (
                  <Button
                    key={s.key}
                    variant={game.scope === s.key ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => game.setScope(s.key)}
                  >
                    {s.label}
                  </Button>
                ))}
              </div>
            )}

            {/* Textbook-based scope selection */}
            {scopeType === 'textbook' && (
              <div className="mb-6">
                <p className="text-sm text-[#9a948c] mb-3">选择教材和单元：</p>
                
                {/* Textbook selector */}
                <div className="max-w-[320px] mx-auto mb-3">
                  <select
                    className="w-full h-11 px-3 rounded-xl border-2 border-[#e0d8c0] text-sm font-semibold bg-white focus:outline-none focus:border-[#8b6fc0]"
                    value={selectedTbIdx ?? ''}
                    onChange={e => {
                      setSelectedTbIdx(e.target.value ? parseInt(e.target.value) : null)
                      setSelectedUnitIdxs([])
                    }}
                  >
                    <option value="">选择教材</option>
                    {textbooks.textbooks.map((tb, i) => (
                      <option key={i} value={i}>{tb.n}</option>
                    ))}
                  </select>
                </div>

                {/* Unit selector */}
                {selectedTbIdx !== null && textbooks.textbooks[selectedTbIdx]?.u && (
                  <div className="max-w-[320px] mx-auto">
                    <p className="text-xs text-[#9a948c] mb-2">选择单元（可多选）：</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {textbooks.textbooks[selectedTbIdx].u.map((unit, ui) => (
                        <button
                          key={ui}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                            selectedUnitIdxs.includes(ui)
                              ? 'bg-[#8b6fc0] text-white shadow-md'
                              : 'bg-white border-2 border-[#e0d8c0] text-[#9a948c] hover:border-[#8b6fc0]'
                          }`}
                          onClick={() => toggleUnitSelection(ui)}
                        >
                          {unit.n}
                        </button>
                      ))}
                    </div>
                    {selectedUnitIdxs.length > 0 && (
                      <p className="text-xs text-[#8b6fc0] mt-2">
                        已选择 {selectedUnitIdxs.length} 个单元
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-4 justify-center flex-wrap">
              {GAME_MODES.map(g => (
                <div key={g.mode}
                  className="group inline-block p-5 sm:p-6 m-2 sm:m-2.5 rounded-2xl border-[3px] border-[#f0e8d8] cursor-pointer
                    min-w-[160px] bg-white shadow-sm
                    hover:border-[#ffc8b0] hover:-translate-y-1.5 hover:shadow-[0_8px_40px_rgba(0,0,0,.08)]
                    active:scale-95"
                  style={{ transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                  onClick={() => handleStart(g.mode)}
                >
                  <span className="text-4xl block mb-2 transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-6">{g.icon}</span>
                  <span className="font-extrabold text-base text-[#2d2a28] block">{g.label}</span>
                  <span className="text-xs text-[#9a948c] block mt-1">{g.desc}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ---- Play ---- */}
      {game.phase === 'play' && game.currentWord && (
        <Card>
          <CardContent>
            {/* Progress bar */}
            <div className="h-2 bg-[#f0ebe0] rounded-full mb-4 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${game.progress}%`, background: 'linear-gradient(90deg, #ff7b5c, #f4b843)' }}
              />
            </div>
            <div className="text-center text-sm text-[#9a948c] font-semibold mb-4">
              第 {game.current + 1} / {game.total} 题
            </div>

            {/* ---- Mode 1: En → Zh ---- */}
            {game.mode === 1 && (() => {
              const options = game.getOptions()
              return (
                <div>
                  <div className="text-3xl sm:text-4xl font-black text-[#2d2a28] text-center mb-1">{game.currentWord.en}</div>
                  {game.currentWord.phonetic && (
                    <div className="text-sm text-[#8b6fc0] font-semibold text-center mb-1">{game.currentWord.phonetic}</div>
                  )}
                  {game.currentWord.pos && (
                    <div className="text-xs text-[#ff7b5c] font-extrabold text-center mb-4">词性：{game.currentWord.pos}</div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    {options.map((w, i) => {
                      let optClass = 'option-btn'
                      if (game.selectedAnswer) {
                        if (w.en === game.currentWord.en) optClass += ' correct'
                        else if (game.selectedAnswer === 'wrong' && w.en !== game.currentWord.en) optClass += ' dimmed'
                      }
                      return (
                        <button
                          key={i}
                          className={`h-12 px-4 rounded-xl border-2 border-[#f0e8d8] text-base font-bold text-[#2d2a28]
                            hover:border-[#ff7b5c] hover:bg-[#fff0eb] active:scale-95 transition-all duration-200
                            ${game.selectedAnswer && w.en === game.currentWord.en ? '!border-[#58b368] !bg-[#e8f5e9] !text-[#58b368]' : ''}
                            ${game.selectedAnswer === 'wrong' && game.selectedAnswer !== null ? 'opacity-50' : ''}
                          `}
                          disabled={!!game.selectedAnswer}
                          onClick={() => handleOptionClick(w.en)}
                        >
                          {game.mode === 1 ? (w.zh || w.en) : w.en}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })()}

            {/* ---- Mode 2: Def → En ---- */}
            {game.mode === 2 && (() => {
              const options = game.getOptions()
              const defText = game.currentWord.def || game.currentWord.zh || ''
              return (
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-[#2d2a28] text-center mb-2">
                    {defText || '(暂无释义)'}
                  </div>
                  {game.currentWord.pos && (
                    <div className="text-xs text-[#ff7b5c] font-extrabold text-center mb-1">{game.currentWord.pos}</div>
                  )}
                  <div className="text-center text-sm text-[#9a948c] mb-4">选择正确的英文单词</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    {options.map((w, i) => (
                      <button
                        key={i}
                        className={`h-12 px-4 rounded-xl border-2 border-[#f0e8d8] text-base font-bold text-[#2d2a28]
                          hover:border-[#ff7b5c] hover:bg-[#fff0eb] active:scale-95 transition-all duration-200
                          ${game.selectedAnswer && w.en === game.currentWord.en ? '!border-[#58b368] !bg-[#e8f5e9] !text-[#58b368]' : ''}
                          ${game.selectedAnswer === 'wrong' && game.selectedAnswer !== null ? 'opacity-50' : ''}
                        `}
                        disabled={!!game.selectedAnswer}
                        onClick={() => handleOptionClick(w.en)}
                      >
                        {w.en}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })()}

            {/* ---- Mode 3: Fill Vowels ---- */}
            {game.mode === 3 && (() => {
              const blanked = game.getBlankedWord()
              return (
                <div>
                  <div className="text-3xl sm:text-4xl font-black text-[#2d2a28] text-center mb-1" style={{ letterSpacing: '0.2em' }}>
                    {blanked}
                  </div>
                  {game.currentWord.phonetic && (
                    <div className="text-sm text-[#8b6fc0] font-semibold text-center mb-1">{game.currentWord.phonetic}</div>
                  )}
                  {game.currentWord.pos && (
                    <div className="text-xs text-[#ff7b5c] font-extrabold text-center mb-4">词性：{game.currentWord.pos}</div>
                  )}
                  <div className="text-center text-sm text-[#9a948c] mb-4">
                    补全缺失的字母（元音为主，含少量辅音）
                    {game.showHint && (
                      <span className="ml-2 text-[#ff7b5c] font-bold">{game.currentWord.zh || ''}</span>
                    )}
                    {!game.showHint && (
                      <button
                        className="ml-2 text-[#ff7b5c] font-bold underline cursor-pointer bg-transparent border-none"
                        onClick={() => game.setShowHint(true)}
                      >
                        💡 提示
                      </button>
                    )}
                  </div>
                  <div className="flex gap-3 justify-center items-center mt-4">
                    <input
                      ref={fillInputRef}
                      type="text"
                      className="h-12 px-4 rounded-xl border-2 border-[#e0d8c0] text-lg font-bold text-center focus:outline-none focus:border-[#ff7b5c] focus:shadow-[0_0_0_4px_rgba(255,123,92,.12)] w-[240px]"
                      placeholder="输入完整单词"
                      autoComplete="off"
                      value={fillAnswer}
                      onChange={e => setFillAnswer(e.target.value)}
                      onKeyDown={handleFillKeyDown}
                      disabled={!!game.selectedAnswer}
                    />
                    <Button onClick={handleFillSubmit} disabled={!!game.selectedAnswer}>确认</Button>
                  </div>
                  {fillResult && (
                    <div className={`text-center mt-3 font-bold ${fillResult === 'correct' ? 'text-[#58b368]' : 'text-[#f2675a]'}`}>
                      {fillResult === 'correct' ? '✅ 正确！' : `❌ 正确答案是: ${game.currentWord.en}`}
                    </div>
                  )}
                </div>
              )
            })()}
          </CardContent>
        </Card>
      )}

      {/* ---- Result ---- */}
      {game.phase === 'result' && (
        <Card>
          <CardContent className="text-center">
            <h2 className="text-xl font-extrabold mb-4">🎯 游戏结束！</h2>

            {/* Score Circle */}
            <div className="mx-auto w-[120px] h-[120px] rounded-full flex items-center justify-center mb-4
              bg-gradient-to-br from-[#fff0eb] to-[#fff] border-[6px] border-[#ff7b5c]"
            >
              <span className="text-3xl font-black text-[#ff7b5c]">{scoreDisplay}%</span>
            </div>

            <div className="text-lg font-bold mb-6">
              {game.scorePct >= 90 ? '🏆 非常棒！' : game.scorePct >= 70 ? '👍 不错！' : game.scorePct >= 60 ? '😊 继续加油！' : '💪 多多练习！'}
            </div>

            <div className="flex justify-center gap-6 mb-6">
              <div className="text-center">
                <div className="text-2xl font-black text-[#58b368]">{game.correct}</div>
                <div className="text-xs text-[#9a948c] font-semibold">✅ 正确</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-[#f2675a]">{game.wrong}</div>
                <div className="text-xs text-[#9a948c] font-semibold">❌ 错误</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-[#8b6fc0]">{game.wrongWords.length}</div>
                <div className="text-xs text-[#9a948c] font-semibold">📝 错词入集</div>
              </div>
            </div>

            {/* Wrong words review */}
            {game.wrongWords.length > 0 && (
              <div className="bg-[#fff9f0] rounded-xl p-4 text-left mb-6">
                <h3 className="text-[#f2675a] font-extrabold mb-2">📋 需要复习的单词</h3>
                {game.getWrongWordDetails().map((w, i) => (
                  <div key={i} className="flex items-center gap-3 py-1.5 border-b border-[#f0e8d8] last:border-0">
                    <span className="font-extrabold text-[#2d2a28] text-sm min-w-[90px]">{w.en}</span>
                    <span className="text-sm text-[#9a948c] font-semibold">{w.zh}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2 justify-center flex-wrap">
              <Button onClick={() => handleStart(1)}>🔤 再玩一局 (模式1)</Button>
              <Button variant="secondary" onClick={() => handleStart(2)}>📖 模式2</Button>
              <Button variant="secondary" onClick={() => handleStart(3)}>✏️ 模式3</Button>
              <Button variant="outline" onClick={game.backToMenu}>↩ 返回菜单</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
