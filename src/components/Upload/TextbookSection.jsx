import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useApp } from '@/context/AppContext'
import useTextbooks from '@/hooks/useTextbooks'
import useWordBank from '@/hooks/useWordBank'

export default function TextbookSection({ ocrWords, onSaved }) {
  const { toast } = useApp()
  const t = useTextbooks()
  const { addWord } = useWordBank()
  const [showResults, setShowResults] = useState(false)
  const [showMgmtModal, setShowMgmtModal] = useState(false)
  const [mgmtTab, setMgmtTab] = useState('add')
  const [newTbName, setNewTbName] = useState('')
  const [newTbPublisher, setNewTbPublisher] = useState('')
  const [newTbGrade, setNewTbGrade] = useState('')
  const [newUnitName, setNewUnitName] = useState('')
  const [pasteText, setPasteText] = useState('')
  const [addUnitTbIdx, setAddUnitTbIdx] = useState(0)
  const [addUnitName, setAddUnitName] = useState('')

  const handleSearch = (val) => {
    t.setQuery(val)
    setShowResults(true)
  }

  const handleSelect = (idx) => {
    t.selectTextbook(idx)
    setShowResults(false)
  }

  const handleImportUnit = () => {
    if (!t.selectedUnit || !t.selectedUnit.w || t.selectedUnit.w.length === 0) {
      toast('该单元暂无词汇数据', 'error')
      return
    }
    let count = 0
    t.selectedUnit.w.forEach(w => {
      addWord({ en: w.en, zh: w.zh, def: '', phonetic: w.phonetic || '', pos: w.pos || '' })
      count++
    })
    toast(`已导入 ${count} 个新词汇`)
  }

  const handleAddTextbook = () => {
    if (!newTbName.trim()) { toast('请输入教材名称', 'error'); return }
    t.addCustomTextbook(newTbName.trim(), newTbPublisher.trim(), newTbGrade.trim())
    setNewTbName(''); setNewTbPublisher(''); setNewTbGrade('')
    toast('教材已添加')
  }

  const handlePasteWords = () => {
    if (!pasteText.trim()) { toast('请粘贴词汇数据', 'error'); return }
    const count = t.pasteWordsToUnit(addUnitTbIdx, parseInt(newUnitName) || 0, pasteText)
    if (count > 0) {
      toast(`已导入 ${count} 个词汇到单元`)
      setPasteText('')
    } else {
      toast('未能解析词汇数据，格式: 每行 "英文 中文"', 'error')
    }
  }

  return (
    <>
      {/* OCR Save Section — shown when OCR results are available */}
      {ocrWords && ocrWords.length > 0 && (
        <Card>
          <CardContent>
            <h2 className="text-lg font-extrabold mb-2 flex items-center gap-2">
              💾 保存OCR结果到教材单元
            </h2>
            <p className="text-xs text-[#9a948c] mb-3">
              将识别到的 {ocrWords.length} 个词汇保存到指定教材单元，同时自动加入词库以便复习。
            </p>

            {/* Textbook search */}
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="🔍 搜索教材名称..."
                className="w-full h-10 px-3 rounded-xl border-2 border-[#e0d8c0] text-sm font-semibold focus:outline-none focus:border-[#ff7b5c]"
                value={t.selectedTb ? t.selectedTb.n : t.query}
                onChange={e => { t.setQuery(e.target.value); setShowResults(true) }}
                onFocus={() => { if (!t.selectedTb && t.textbooks.length > 0) setShowResults(true) }}
                onClick={() => { if (!t.selectedTb && t.textbooks.length > 0) setShowResults(true) }}
              />
              {t.selectedTb && (
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#f2675a] text-lg font-bold cursor-pointer bg-transparent border-none"
                  onClick={() => { t.clearSelection(); setShowResults(false) }}
                >✕</button>
              )}
              {showResults && !t.selectedTb && (
                <div className="absolute top-full left-0 right-0 z-50 bg-white rounded-xl border-2 border-[#f0e8d8] shadow-lg max-h-[200px] overflow-y-auto mt-1">
                  {t.searchResults.length === 0 ? (
                    <div className="p-4 text-sm text-[#9a948c] text-center">未找到匹配的教材</div>
                  ) : (
                    t.searchResults.map((tb, i) => (
                      <div
                        key={i}
                        className="px-4 py-2.5 cursor-pointer hover:bg-[#fff0eb] border-b border-[#f0ebe0] last:border-0 transition-colors"
                        onClick={() => { t.selectTextbook(i); setShowResults(false) }}
                      >
                        <div className="font-bold text-sm text-[#2d2a28]">{tb.n}</div>
                        <div className="text-xs text-[#9a948c]">{tb.p} · {(Array.isArray(tb.u) ? tb.u : []).length}个单元</div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Unit selector */}
            {t.selectedTb && (
              <select
                className="w-full h-10 px-3 rounded-xl border-2 border-[#e0d8c0] text-sm font-semibold bg-white focus:outline-none focus:border-[#ff7b5c] mb-3"
                value={t.selectedUnitIdx ?? ''}
                onChange={e => t.setSelectedUnitIdx(e.target.value ? parseInt(e.target.value) : null)}
              >
                <option value="">选择单元</option>
                {(Array.isArray(t.selectedTb.u) ? t.selectedTb.u : []).map((u, i) => (
                  <option key={i} value={i}>{u.n}{u.w && u.w.length > 0 ? ` (${u.w.length}词)` : ''}</option>
                ))}
              </select>
            )}

            <Button
              disabled={!(t.selectedTb && t.selectedUnitIdx !== null)}
              onClick={() => {
                if (!t.selectedTb || t.selectedUnitIdx === null) return
                const words = ocrWords.map(w => ({
                  en: w.en, zh: w.zh || '', phonetic: w.phonetic || '', pos: w.pos || ''
                }))
                t.setUnitWords(t.selectedIdx, t.selectedUnitIdx, words)
                // Also add each word to the word bank for review
                ocrWords.forEach(w => { if (w.en) addWord(w) })
                if (onSaved) onSaved(words.length)
                toast(`已保存 ${words.length} 词到「${t.selectedUnit?.n || '所选单元'}」`)
              }}
            >
              📥 保存 {ocrWords.length} 词到{t.selectedUnit ? `「${t.selectedUnit.n}」` : '所选单元'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Existing textbook search section */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-extrabold flex items-center gap-2">
              📚 教材词汇库
              <span className="text-xs text-[#9a948c] font-normal">(20+套教材)</span>
            </h2>
            <button
              className="px-3 py-1.5 rounded-xl text-xs font-bold border-2 border-[#e0d8c0] text-[#9a948c] bg-transparent hover:border-[#ff7b5c] transition-all duration-200"
              onClick={() => setShowMgmtModal(true)}
            >
              ⚙️ 管理
            </button>
          </div>
          <p className="text-sm text-[#9a948c] mb-3">
            搜索教材名称 → 选择单元 → 一键导入。支持模糊搜索（如搜"人教""Think""外研"）。
          </p>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 搜索教材名称（如：人教版、Think、新概念...）"
              className="w-full h-11 px-4 rounded-xl border-2 border-[#e0d8c0] text-sm font-semibold focus:outline-none focus:border-[#ff7b5c] focus:shadow-[0_0_0_4px_rgba(255,123,92,.12)]"
              value={t.selectedTb ? t.selectedTb.n : t.query}
              onChange={e => handleSearch(e.target.value)}
              onFocus={() => { if (!t.selectedTb && t.textbooks.length > 0) setShowResults(true) }}
              onClick={() => { if (!t.selectedTb && t.textbooks.length > 0) setShowResults(true) }}
            />
            {t.selectedTb && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#f2675a] text-lg font-bold cursor-pointer bg-transparent border-none"
                onClick={() => { t.clearSelection(); setShowResults(false) }}
              >
                ✕
              </button>
            )}

            {/* Search results dropdown */}
            {showResults && !t.selectedTb && (
              <div className="absolute top-full left-0 right-0 z-50 bg-white rounded-xl border-2 border-[#f0e8d8] shadow-lg max-h-[280px] overflow-y-auto mt-1">
                {t.searchResults.length === 0 ? (
                  <div className="p-4 text-sm text-[#9a948c] text-center">未找到匹配的教材</div>
                ) : (
                  t.searchResults.map((tb, i) => {
                    const hasData = (Array.isArray(tb.u) ? tb.u : []).some(u => u && u.w && u.w.length > 0)
                    return (
                      <div
                        key={i}
                        className="px-4 py-3 cursor-pointer hover:bg-[#fff0eb] border-b border-[#f0ebe0] last:border-0 transition-colors"
                        onClick={() => handleSelect(i)}
                      >
                        <div className="font-bold text-sm text-[#2d2a28]">
                          {tb.n}
                          <span className={`ml-2 px-2 py-0.5 rounded-lg text-xs font-bold ${hasData ? 'bg-[#e8f5e9] text-[#58b368]' : 'bg-[#f5f2eb] text-[#9a948c]'}`}>
                            {hasData ? '有数据' : '待补充'}
                          </span>
                        </div>
                        <div className="text-xs text-[#9a948c] mt-0.5">
                          {tb.p} · {tb.g} · {(Array.isArray(tb.u) ? tb.u : []).length}个单元
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            )}
          </div>

          {/* Selected textbook info */}
          {t.selectedTb && (
            <div className="mt-3 p-4 rounded-xl bg-[#fef9f4] border border-[#f0ebe0]">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-extrabold text-[#2d2a28]">{t.selectedTb.n}</span>
                  <span className="text-xs text-[#9a948c] ml-2">
                    {t.selectedTb.p} · {t.selectedTb.g} · {(Array.isArray(t.selectedTb.u) ? t.selectedTb.u : []).length}个单元
                  </span>
                </div>
              </div>

              {/* Unit selector */}
              <select
                className="w-full h-10 px-3 rounded-xl border-2 border-[#e0d8c0] text-sm font-semibold bg-white focus:outline-none focus:border-[#ff7b5c] mb-3"
                value={t.selectedUnitIdx ?? ''}
                onChange={e => t.setSelectedUnitIdx(e.target.value ? parseInt(e.target.value) : null)}
              >
                <option value="">选择单元</option>
                {(Array.isArray(t.selectedTb.u) ? t.selectedTb.u : []).map((u, i) => {
                  const hasData = u.w && u.w.length > 0
                  return (
                    <option key={i} value={i}>{u.n}{hasData ? ' ✅' : ' 🔍'}</option>
                  )
                })}
              </select>

              {/* Unit preview */}
              {t.selectedUnit && (
                <div>
                  {t.selectedUnit.w && t.selectedUnit.w.length > 0 ? (
                    <>
                      <div className="text-sm text-[#9a948c] mb-2">
                        📋 {t.selectedUnit.n} — 共 <strong>{t.selectedUnit.w.length}</strong> 个词汇 ✅ 已内置
                      </div>
                      <div className="max-h-[200px] overflow-y-auto border border-[#f0ebe0] rounded-lg bg-white p-2">
                        {t.selectedUnit.w.map((w, i) => (
                          <div key={i} className="flex items-center gap-2 py-1 px-2 text-sm border-b border-[#f0ebe0] last:border-0">
                            <span className="font-extrabold text-[#2d2a28] min-w-[80px]">{w.en}</span>
                            {w.phonetic && <span className="text-xs text-[#8b6fc0]">{w.phonetic}</span>}
                            {w.pos && <span className="text-xs text-[#ff7b5c] font-bold bg-[#fff0eb] px-1.5 py-0.5 rounded">{w.pos}</span>}
                            <span className="text-[#9a948c]">{w.zh}</span>
                          </div>
                        ))}
                      </div>
                      <Button className="mt-3" onClick={handleImportUnit}>
                        📥 导入此单元 ({t.selectedUnit.w.length}词)
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-4 text-[#9a948c] text-sm">
                      🔍 该单元暂无词汇数据
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Management Modal */}
      {showMgmtModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
          onClick={e => { if (e.target === e.currentTarget) setShowMgmtModal(false) }}
        >
          <div className="bg-white rounded-2xl p-6 max-w-[560px] w-[92%] max-h-[85vh] overflow-y-auto shadow-[0_8px_40px_rgba(0,0,0,.08)] animate-modal-in">
            <h3 className="font-extrabold text-lg mb-4">⚙️ 教材管理</h3>

            {/* Tabs */}
            <div className="flex gap-2 mb-4">
              {[
                { key: 'add', label: '➕ 添加教材' },
                { key: 'units', label: '📝 管理单元' },
                { key: 'delete', label: '🗑 删除' },
              ].map(tab => (
                <button
                  key={tab.key}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all duration-200 ${
                    mgmtTab === tab.key
                      ? 'bg-[#ff7b5c] text-white border-[#ff7b5c]'
                      : 'bg-transparent text-[#9a948c] border-[#e0d8c0] hover:border-[#ff7b5c]'
                  }`}
                  onClick={() => setMgmtTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Add textbook */}
            {mgmtTab === 'add' && (
              <div className="space-y-3">
                <input
                  className="w-full h-11 px-3.5 rounded-xl border-2 border-[#e8e0d0] text-sm font-semibold focus:outline-none focus:border-[#ff7b5c]"
                  placeholder="教材名称 * (如: 人教版七年级上)"
                  value={newTbName}
                  onChange={e => setNewTbName(e.target.value)}
                />
                <div className="flex gap-2">
                  <input
                    className="flex-1 h-11 px-3.5 rounded-xl border-2 border-[#e8e0d0] text-sm focus:outline-none focus:border-[#ff7b5c]"
                    placeholder="出版社 (如: 人民教育出版社)"
                    value={newTbPublisher}
                    onChange={e => setNewTbPublisher(e.target.value)}
                  />
                  <input
                    className="w-[120px] h-11 px-3.5 rounded-xl border-2 border-[#e8e0d0] text-sm focus:outline-none focus:border-[#ff7b5c]"
                    placeholder="年级 (如: 七上)"
                    value={newTbGrade}
                    onChange={e => setNewTbGrade(e.target.value)}
                  />
                </div>
                <Button onClick={handleAddTextbook}>添加教材</Button>
              </div>
            )}

            {/* Manage units */}
            {mgmtTab === 'units' && (
              <div className="space-y-3">
                <select
                  className="w-full h-10 px-3 rounded-xl border-2 border-[#e0d8c0] text-sm font-semibold bg-white focus:outline-none focus:border-[#ff7b5c]"
                  value={addUnitTbIdx}
                  onChange={e => setAddUnitTbIdx(parseInt(e.target.value))}
                >
                  {t.textbooks.map((tb, i) => (
                    <option key={i} value={i}>{tb.n}</option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <input
                    className="flex-1 h-11 px-3.5 rounded-xl border-2 border-[#e8e0d0] text-sm focus:outline-none focus:border-[#ff7b5c]"
                    placeholder="新单元名称"
                    value={addUnitName}
                    onChange={e => setAddUnitName(e.target.value)}
                  />
                  <Button variant="outline" onClick={() => {
                    if (!addUnitName.trim()) { toast('请输入单元名称', 'error'); return }
                    t.addUnitToTextbook(addUnitTbIdx, addUnitName.trim())
                    setAddUnitName('')
                    toast('单元已添加')
                  }}>+ 添加单元</Button>
                </div>

                {/* Paste words */}
                <div>
                  <p className="text-xs text-[#9a948c] mb-1">粘贴词汇（每行格式：英文 中文）</p>
                  <select
                    className="w-full h-9 px-3 rounded-xl border-2 border-[#e0d8c0] text-xs bg-white mb-2 focus:outline-none focus:border-[#ff7b5c]"
                    value={newUnitName}
                    onChange={e => setNewUnitName(e.target.value)}
                  >
                    <option value="">选择单元粘贴词汇</option>
                    {(Array.isArray(t.textbooks[addUnitTbIdx]?.u) ? t.textbooks[addUnitTbIdx].u : []).map((u, i) => (
                      <option key={i} value={i}>{u.n} ({u.w ? u.w.length : 0}词)</option>
                    ))}
                  </select>
                  <textarea
                    className="w-full h-24 px-3 py-2 rounded-xl border-2 border-[#e0d8c0] text-xs resize-y focus:outline-none focus:border-[#ff7b5c]"
                    placeholder="apple 苹果&#10;book 书&#10;cat 猫"
                    value={pasteText}
                    onChange={e => setPasteText(e.target.value)}
                  />
                  <Button size="sm" className="mt-2" onClick={handlePasteWords}>📥 导入词汇</Button>
                </div>
              </div>
            )}

            {/* Delete */}
            {mgmtTab === 'delete' && (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {t.textbooks.map((tb, i) => (
                  <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-[#fef0ee]">
                    <div>
                      <span className="font-bold text-sm text-[#2d2a28]">{tb.n}</span>
                      <span className="text-xs text-[#9a948c] ml-2">{(Array.isArray(tb.u) ? tb.u : []).length}单元</span>
                    </div>
                    <button
                      className="text-xs text-[#f2675a] font-bold px-3 py-1 rounded-lg border border-[#f2675a] bg-transparent hover:bg-[#fef0ee] transition-colors"
                      onClick={() => { t.deleteTextbook(i); toast('已删除: ' + tb.n) }}
                    >
                      删除
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={() => setShowMgmtModal(false)}>关闭</Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
