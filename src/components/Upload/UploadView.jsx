import { useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useApp } from '@/context/AppContext'
import useOCR from '@/hooks/useOCR'
import useWordBank from '@/hooks/useWordBank'
import TextbookSection from './TextbookSection'

export default function UploadView() {
  const { toast } = useApp()
  const ocr = useOCR()
  const { addWord } = useWordBank()
  const [dragOver, setDragOver] = useState(false)

  const handleFile = useCallback((file) => {
    if (!file) return
    if (!file.type.match(/image\/(jpeg|png|webp)/)) {
      toast('请上传 JPG / PNG / WebP 格式的图片', 'error')
      return
    }
    ocr.reset()
    setTimeout(() => ocr.processFile(file), 100)
  }, [ocr, toast])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0])
  }, [handleFile])

  const onFileInput = useCallback((e) => {
    if (e.target.files.length) handleFile(e.target.files[0])
    e.target.value = ''
  }, [handleFile])

  const importOne = (w) => {
    addWord(w)
    toast('已导入: ' + w.en)
  }

  const importAllFound = () => {
    ocr.found.forEach(w => addWord(w))
    toast(`已导入 ${ocr.found.length} 个单词`)
  }

  const importAll = () => {
    let imported = 0, skipped = 0
    const importWord = (w) => {
      const en = typeof w === 'string' ? w : w.en
      const safeEn = en.replace(/[^a-z]/g, '_')
      const zhEl = document.getElementById('ocr_zh_' + safeEn)
      const defEl = document.getElementById('ocr_def_' + safeEn)
      const phEl = document.getElementById('ocr_ph_' + safeEn)
      const posEl = document.getElementById('ocr_pos_' + safeEn)
      const zh = zhEl?.value?.trim() || (typeof w === 'object' ? (w.zh || '') : '')
      const def = defEl?.value?.trim() || (typeof w === 'object' ? (w.def || '') : '')
      const phonetic = phEl?.value?.trim() || (typeof w === 'object' ? (w.phonetic || '') : '')
      const pos = posEl?.value?.trim() || (typeof w === 'object' ? (w.pos || '') : '')
      if (!def) { skipped++; return }
      addWord({ en, zh: zh || '(待补充)', def, phonetic, pos })
      imported++
    }
    ocr.found.forEach(importWord)
    ocr.notFound.forEach(importWord)
    if (skipped > 0) toast(`已导入 ${imported} 个单词，${skipped} 个因缺少英文释义被跳过`, 'error')
    else toast(`已导入 ${imported} 个单词`)
  }

  const importMatched = () => {
    let imported = 0
    ocr.found.forEach(w => {
      const safeEn = w.en.replace(/[^a-z]/g, '_')
      const def = document.getElementById('ocr_def_' + safeEn)?.value?.trim() || w.def || ''
      if (def) { addWord(w); imported++ }
    })
    toast(`已导入 ${imported} 个单词`)
  }

  const renderWordRow = (w, i, isNotFound) => {
    const en = typeof w === 'string' ? w : w.en
    const zh = typeof w === 'string' ? '' : (w.zh || '')
    const def = typeof w === 'string' ? '' : (w.def || '')
    const phonetic = typeof w === 'string' ? '' : (w.phonetic || '')
    const pos = typeof w === 'string' ? '' : (w.pos || '')
    const safeEn = en.replace(/[^a-z]/g, '_')

    const wordSugs = isNotFound && ocr.suggestions ? (ocr.suggestions[en.toLowerCase()] || []) : []

    return (
      <tr key={safeEn + i} className={isNotFound ? 'bg-[#fff5f5]' : 'bg-white'}>
        <td className="py-2 px-2 text-sm text-[#9a948c]">{i + 1}</td>
        <td className="py-2 px-2">
          <span className="font-extrabold text-[#2d2a28] text-sm">{en}</span>
          {wordSugs.length > 0 && (
            <div className="flex gap-1 flex-wrap mt-1">
              {wordSugs.map((s, si) => (
                <span
                  key={si}
                  className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-[#f0e8ff] text-[#8b6fc0] cursor-pointer hover:bg-[#e0d0ff] border border-[#d0c0f0]"
                  title={`${s.entry.en}: ${s.entry.zh || ''} (${s.distance === 1 ? '一字之差' : '相似'})`}
                  onClick={() => {
                    const zhEl = document.getElementById('ocr_zh_' + safeEn)
                    const phEl = document.getElementById('ocr_ph_' + safeEn)
                    const posEl = document.getElementById('ocr_pos_' + safeEn)
                    const defEl = document.getElementById('ocr_def_' + safeEn)
                    if (zhEl) zhEl.value = s.entry.zh || ''
                    if (phEl) phEl.value = s.entry.phonetic || ''
                    if (posEl) posEl.value = s.entry.pos || ''
                    if (defEl) defEl.value = s.entry.def || ''
                  }}
                >
                  {s.entry.en}
                </span>
              ))}
            </div>
          )}
        </td>
        <td className="py-2 px-1">
          <input id={'ocr_zh_' + safeEn} defaultValue={zh} placeholder="中文" className="w-[72px] h-8 px-2 rounded-lg border border-[#e0d8c0] text-xs focus:outline-none focus:border-[#ff7b5c]" />
        </td>
        <td className="py-2 px-1">
          <input id={'ocr_ph_' + safeEn} defaultValue={phonetic} placeholder="音标" className="w-[90px] h-8 px-2 rounded-lg border border-[#e0d8c0] text-xs focus:outline-none focus:border-[#ff7b5c]" />
        </td>
        <td className="py-2 px-1">
          <input id={'ocr_pos_' + safeEn} defaultValue={pos} placeholder="词性" className="w-[52px] h-8 px-2 rounded-lg border border-[#e0d8c0] text-xs focus:outline-none focus:border-[#ff7b5c]" />
        </td>
        <td className="py-2 px-1">
          <input id={'ocr_def_' + safeEn} defaultValue={def} placeholder={isNotFound ? '⚠️ 英文释义 (必填)' : '英文释义'}
            className={`h-8 px-2 rounded-lg border text-xs focus:outline-none focus:border-[#ff7b5c] ${isNotFound ? 'w-[160px] border-[#f2675a]' : 'w-[160px] border-[#e0d8c0]'}`}
          />
        </td>
        <td className="py-2 px-1">
          <Button size="sm" variant={isNotFound ? 'default' : 'outline'} onClick={() => {
            const zhV = document.getElementById('ocr_zh_' + safeEn)?.value?.trim() || zh
            const defV = document.getElementById('ocr_def_' + safeEn)?.value?.trim() || def
            if (!defV) { toast('请填写英文释义', 'error'); return }
            importOne({ en, zh: zhV || '(待补充)', def: defV, phonetic: document.getElementById('ocr_ph_' + safeEn)?.value?.trim() || phonetic, pos: document.getElementById('ocr_pos_' + safeEn)?.value?.trim() || pos })
          }}>导入</Button>
        </td>
      </tr>
    )
  }

  const renderFlatTable = (title, words, isNotFound) => {
    if (!words.length) return null
    return (
      <div className="mt-3">
        <p className={`font-bold text-sm ${isNotFound ? 'text-[#f2675a]' : 'text-[#58b368]'}`}>{title}</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#f0ebe0]">
                <th className="py-2 px-2 text-left text-xs text-[#9a948c]">#</th>
                <th className="py-2 px-2 text-left text-xs text-[#9a948c]">英文</th>
                <th className="py-2 px-1 text-left text-xs text-[#9a948c]">中文</th>
                <th className="py-2 px-1 text-left text-xs text-[#9a948c]">音标</th>
                <th className="py-2 px-1 text-left text-xs text-[#9a948c]">词性</th>
                <th className="py-2 px-1 text-left text-xs text-[#9a948c]">英文释义{isNotFound ? ' ⚠️必填' : ''}</th>
                <th className="py-2 px-1 text-left text-xs text-[#9a948c]">导入</th>
              </tr>
            </thead>
            <tbody>
              {words.map((w, i) => renderWordRow(w, i, isNotFound))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in space-y-4">
      {/* Upload Zone */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-extrabold flex items-center gap-2">
              📷 拍照/上传单词表
            </h2>
            <div className="flex gap-2">
              <button
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all duration-200 ${
                  ocr.autoCorrect
                    ? 'bg-[#8b6fc0] text-white border-[#8b6fc0]'
                    : 'bg-transparent text-[#9a948c] border-[#e0d8c0]'
                }`}
                onClick={() => ocr.setAutoCorrect(!ocr.autoCorrect)}
              >
                {ocr.autoCorrect ? '🔮 ' : ''}词典辅助匹配
              </button>
              <button
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all duration-200 ${
                  ocr.tocMode
                    ? 'bg-[#58b368] text-white border-[#58b368]'
                    : 'bg-transparent text-[#9a948c] border-[#e0d8c0]'
                }`}
                onClick={() => ocr.setTocMode(!ocr.tocMode)}
              >
                {ocr.tocMode ? '✅ ' : ''}📋 TOC模式
              </button>
            </div>
          </div>
          <p className="text-sm text-[#9a948c] mb-3">
            拍摄课本词汇表、试卷单词等。AI自动识别英文单词，开启「词典辅助匹配」可获取释义建议。
          </p>
          <div
            className={`border-[3px] border-dashed rounded-2xl p-14 text-center cursor-pointer bg-white/40 transition-all duration-300
              ${dragOver ? 'border-[#ff7b5c] bg-[#fff0eb] scale-[1.01]' : 'border-[#e0d8c8] hover:border-[#ff7b5c] hover:bg-[#fff0eb] hover:scale-[1.01]'}`}
            style={{ transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            onClick={() => document.getElementById('ocrFileInput').click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
          >
            <span className="text-5xl block mb-2.5 animate-float">📸</span>
            <p className="font-bold text-[#2d2a28]">
              {ocr.tocMode ? '点击上传目录页图片 (TOC模式)' : '点击上传 或 拖拽图片到此处'}
            </p>
            <p className="text-sm text-[#9a948c]">支持 JPG / PNG，建议清晰拍摄</p>
          </div>
          <input
            id="ocrFileInput"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={onFileInput}
          />
        </CardContent>
      </Card>

      {/* OCR Status */}
      {ocr.status !== 'idle' && (
        <Card>
          <CardContent>
            {ocr.status === 'preprocessing' || ocr.status === 'recognizing' ? (
              <div className="text-center py-4">
                <div className="h-2 bg-[#f0ebe0] rounded-full mb-3 overflow-hidden max-w-[400px] mx-auto">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${ocr.progress}%`, background: 'linear-gradient(90deg, #ff7b5c, #f4b843)' }}
                  />
                </div>
                <p className="text-sm text-[#9a948c]">{ocr.statusMsg}</p>
              </div>
            ) : ocr.status === 'error' ? (
              <p className="text-[#f2675a] font-bold text-center">{ocr.statusMsg}</p>
            ) : null}
          </CardContent>
        </Card>
      )}

      {/* OCR Results */}
      {ocr.status === 'done' && (
        <Card>
          <CardContent>
            <h2 className="text-lg font-extrabold mb-2">📋 识别结果 — 请核对后导入</h2>
            <p className="text-sm text-[#58b368] font-bold mb-1">{ocr.statusMsg}</p>
            {ocr.autoCorrect && Object.keys(ocr.suggestions).length > 0 && (
              <p className="text-xs text-[#8b6fc0] mb-2">
                💡 为 {Object.keys(ocr.suggestions).length} 个未匹配词找到词典候选 (点击小标签可用)
              </p>
            )}

            <div className="flex gap-2 flex-wrap mb-4">
              <Button onClick={importAll}>📥 全部导入 ({ocr.found.length + ocr.notFound.length}词)</Button>
              <Button variant="outline" onClick={importMatched}>导入已匹配 ({ocr.found.length}词)</Button>
            </div>

            {/* TOC Mode: unit-grouped view */}
            {ocr.tocMode && ocr.unitView && ocr.unitView.unitView && ocr.unitView.unitView.length >= 2 ? (
              <div>
                <p className="text-sm text-[#8b6fc0] font-bold mb-2">📑 检测到 {ocr.unitView.unitView.length} 个单元结构，按单元分组展示</p>
                {ocr.unitView.unitView.map((u, ui) => {
                  const unitTotal = u.found.length + u.notFound.length
                  if (!unitTotal) return null
                  return (
                    <details key={ui} className="mb-3 border border-[#f0ebe0] rounded-xl overflow-hidden" open={ui < 3}>
                      <summary className="bg-[#fef9f4] px-4 py-2.5 cursor-pointer font-bold text-[#2d2a28] hover:bg-[#fff0eb]">
                        {u.header || 'Unit ' + u.num}
                        <span className="font-normal text-xs text-[#9a948c] ml-2">— {unitTotal}词 ({u.found.length}匹配)</span>
                      </summary>
                      <div className="p-3">
                        {renderFlatTable(`✅ 已匹配: ${u.found.length}词`, u.found, false)}
                        {renderFlatTable(`❓ 未匹配: ${u.notFound.length}词`, u.notFound, true)}
                      </div>
                    </details>
                  )
                })}
                {ocr.unitView.unassignedFound && ocr.unitView.unassignedFound.length > 0 && (
                  <details className="mb-3 border border-[#f0ebe0] rounded-xl overflow-hidden">
                    <summary className="bg-[#fef9f4] px-4 py-2.5 cursor-pointer font-bold text-[#2d2a28]">📌 未归类单词</summary>
                    <div className="p-3">
                      {renderFlatTable(`✅ 已匹配: ${ocr.unitView.unassignedFound.length}词`, ocr.unitView.unassignedFound, false)}
                      {ocr.unitView.unassignedNotFound && renderFlatTable(`❓ 未匹配: ${ocr.unitView.unassignedNotFound.length}词`, ocr.unitView.unassignedNotFound, true)}
                    </div>
                  </details>
                )}
              </div>
            ) : (
              /* Normal mode: flat view */
              <div>
                {renderFlatTable(`✅ 已匹配词典: ${ocr.found.length} 个单词`, ocr.found, false)}
                {renderFlatTable(`❓ 未匹配词典: ${ocr.notFound.length} 个单词 — 请手动填写信息后导入`, ocr.notFound, true)}
              </div>
            )}

            <p className="text-xs text-[#f2675a] mt-3">⚠️ 英文释义为必填项，否则游戏第二关无法进行。已匹配单词大部分已有释义，请核对。</p>

            {/* Raw OCR text (debug) */}
            <details className="mt-4 text-xs">
              <summary className="text-[#9a948c] cursor-pointer">🔍 查看原始识别文本 (调试用)</summary>
              <pre className="whitespace-pre-wrap mt-2 p-3 bg-[#f5f2eb] rounded-xl text-xs max-h-40 overflow-y-auto">{ocr.rawText}</pre>
            </details>
          </CardContent>
        </Card>
      )}

      <TextbookSection
        ocrWords={
          ocr.status === 'done' && (ocr.found.length > 0 || ocr.notFound.length > 0)
            ? [...ocr.found, ...ocr.notFound.map(w => ({ en: w, zh: '', def: '', phonetic: '', pos: '' }))]
            : null
        }
        onSaved={(count) => toast(`已保存 ${count} 个词汇到教材单元`)}
      />
    </div>
  )
}
