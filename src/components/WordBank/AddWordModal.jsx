import { useState } from 'react'
import DICTIONARY from '@/data/dictionary'
import { useApp } from '@/context/AppContext'

export default function AddWordModal({ open, onClose, onSave }) {
  const [en, setEn] = useState('')
  const [zh, setZh] = useState('')
  const [phonetic, setPhonetic] = useState('')
  const [pos, setPos] = useState('')
  const [def, setDef] = useState('')
  const { toast } = useApp()

  if (!open) return null

  const autoFill = (word) => {
    const d = DICTIONARY.find(d => d.en.toLowerCase() === word.toLowerCase())
    if (d) {
      if (!zh) setZh(d.zh)
      if (!phonetic) setPhonetic(d.phonetic || '')
      if (!pos) setPos(d.pos || '')
      if (!def) setDef(d.def || '')
    }
  }

  const handleEnBlur = () => { if (en.trim()) autoFill(en.trim()) }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      autoFill(en.trim())
    }
  }

  const handleSave = () => {
    if (!en.trim()) {
      toast('请输入英文单词', 'error')
      return
    }
    if (!zh.trim()) {
      toast('请输入中文翻译', 'error')
      return
    }
    onSave({ en: en.trim(), zh: zh.trim(), phonetic, pos, def })
    toast(`已添加: ${en.trim()}`)
    setEn(''); setZh(''); setPhonetic(''); setPos(''); setDef('')
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="bg-white rounded-2xl p-7 max-w-[520px] w-[92%] max-h-[85vh] overflow-y-auto shadow-[0_8px_40px_rgba(0,0,0,.08)] animate-modal-in"
      >
        <h3 className="font-extrabold text-lg mb-4">添加单词</h3>
        <input
          type="text"
          placeholder="英文单词 *"
          className="w-full h-11 px-3.5 rounded-xl border-2 border-[#e8e0d0] text-base font-semibold mb-2.5 focus:outline-none focus:border-[#ff7b5c] focus:shadow-[0_0_0_4px_rgba(255,123,92,.12)]"
          value={en}
          onChange={e => setEn(e.target.value)}
          onBlur={handleEnBlur}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <div className="flex gap-2.5">
          <input
            type="text"
            placeholder="音标 (如 /ˈæpl/)"
            className="flex-1 h-11 px-3.5 rounded-xl border-2 border-[#e8e0d0] text-sm font-semibold mb-2.5 focus:outline-none focus:border-[#ff7b5c] focus:shadow-[0_0_0_4px_rgba(255,123,92,.12)]"
            value={phonetic}
            onChange={e => setPhonetic(e.target.value)}
          />
          <input
            type="text"
            placeholder="词性 (如 n.)"
            className="w-[100px] h-11 px-3.5 rounded-xl border-2 border-[#e8e0d0] text-sm font-semibold mb-2.5 focus:outline-none focus:border-[#ff7b5c] focus:shadow-[0_0_0_4px_rgba(255,123,92,.12)]"
            value={pos}
            onChange={e => setPos(e.target.value)}
          />
        </div>
        <p className="text-xs text-[#9a948c] -mt-1 mb-2.5">音标和词性可从词典自动填充，也可手动输入</p>
        <input
          type="text"
          placeholder="中文翻译 *"
          className="w-full h-11 px-3.5 rounded-xl border-2 border-[#e8e0d0] text-base font-semibold mb-2.5 focus:outline-none focus:border-[#ff7b5c] focus:shadow-[0_0_0_4px_rgba(255,123,92,.12)]"
          value={zh}
          onChange={e => setZh(e.target.value)}
        />
        <input
          type="text"
          placeholder="英文释义（可选，用于游戏2）"
          className="w-full h-11 px-3.5 rounded-xl border-2 border-[#e8e0d0] text-base font-semibold mb-4 focus:outline-none focus:border-[#ff7b5c] focus:shadow-[0_0_0_4px_rgba(255,123,92,.12)]"
          value={def}
          onChange={e => setDef(e.target.value)}
        />
        <div className="flex gap-2 justify-end">
          <button
            className="h-9 px-[18px] rounded-[22px] border-2 border-[#ff7b5c] text-[#ff7b5c] bg-transparent text-sm font-bold hover:bg-[#fff0eb] hover:-translate-y-0.5 transition-all"
            style={{ transitionDuration: '250ms', transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            onClick={onClose}
          >
            取消
          </button>
          <button
            className="h-9 px-[18px] rounded-[22px] bg-[#ff7b5c] text-white text-sm font-bold shadow-[0_4px_12px_rgba(255,123,92,.3)] hover:bg-[#f06d4e] hover:-translate-y-0.5 transition-all"
            style={{ transitionDuration: '250ms', transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            onClick={handleSave}
          >
            保存
          </button>
        </div>
      </div>
    </div>
  )
}
