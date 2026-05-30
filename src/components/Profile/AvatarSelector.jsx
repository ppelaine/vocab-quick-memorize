import { useState } from 'react'
import { Button } from '@/components/ui/button'

const AVATAR_EMOJIS = [
  '👤', '👩', '👨', '👧', '👦', '👩‍🦰', '👨‍🦰', '👩‍🦱', '👨‍🦱', '👩‍🦳',
  '👨‍🦳', '🧑', '👱', '🧔', '👲', '🧕', '👳', '👸', '🤴', '👼',
  '🐶', '🐱', '🐼', '🐨', '🐰', '🦊', '🐻', '🐼', '🐨', '🦁',
  '🐯', '🐮', '🐷', '🐸', '🐵', '🐔', '🦄', '🐴', '🦋', '🐝',
  '🌟', '🌙', '☀️', '❤️', '💎', '🎨', '🎭', '🎪', '🎯', '🎮',
  '🚀', '✈️', '🚁', '🚂', '🚗', '🚲', '⚽', '🏀', '🎾', '🎸'
]

const AVATAR_COLORS = [
  '#ff7b5c', '#f4b843', '#58b368', '#8b6fc0', '#5b9bd5',
  '#ff9f7f', '#f7c568', '#7bc986', '#a58bd4', '#7ab8e3',
  '#ff6b9d', '#c471ed', '#4facfe', '#00f2fe', '#43e97b'
]

export default function AvatarSelector({ open, onClose, onSelect, currentAvatar, currentColor }) {
  const [selectedEmoji, setSelectedEmoji] = useState(currentAvatar || '👤')
  const [selectedColor, setSelectedColor] = useState(currentColor || '#ff7b5c')
  const [customEmoji, setCustomEmoji] = useState('')

  const handleSelect = () => {
    onSelect({ emoji: selectedEmoji, color: selectedColor })
  }

  const handleEmojiInput = (e) => {
    const val = e.target.value
    if (val.length <= 2) {
      setCustomEmoji(val)
    }
  }

  const handleCustomApply = () => {
    if (customEmoji) {
      setSelectedEmoji(customEmoji)
      setCustomEmoji('')
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl p-6 max-w-[520px] w-[92%] max-h-[85vh] overflow-y-auto shadow-[0_8px_40px_rgba(0,0,0,.08)] animate-modal-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-lg">🎨 选择头像</h3>
          <button
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#9a948c] hover:bg-[#f5f2eb] transition-colors"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="flex justify-center mb-6">
          <div
            className="w-28 h-28 rounded-full flex items-center justify-center text-6xl font-black shadow-xl"
            style={{ backgroundColor: selectedColor }}
          >
            {selectedEmoji}
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-[#9a948c] mb-2">选择图标：</p>
          <div className="flex flex-wrap gap-1.5 max-h-[180px] overflow-y-auto">
            {AVATAR_EMOJIS.map((emoji, i) => (
              <button
                key={i}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl transition-all duration-200 ${
                  selectedEmoji === emoji
                    ? 'bg-[#fff0eb] border-2 border-[#ff7b5c] scale-110'
                    : 'bg-[#f5f2eb] border-2 border-transparent hover:border-[#e0d8c0] hover:scale-105'
                }`}
                onClick={() => setSelectedEmoji(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <input
              type="text"
              className="flex-1 h-10 px-3 rounded-xl border-2 border-[#e8e0d0] text-sm font-semibold focus:outline-none focus:border-[#ff7b5c]"
              placeholder="输入自定义表情"
              value={customEmoji}
              onChange={handleEmojiInput}
              onKeyDown={e => { if (e.key === 'Enter') handleCustomApply() }}
            />
            <Button size="sm" onClick={handleCustomApply}>应用</Button>
          </div>
        </div>

        <div>
          <p className="text-sm text-[#9a948c] mb-2">选择背景色：</p>
          <div className="flex flex-wrap gap-2">
            {AVATAR_COLORS.map((color, i) => (
              <button
                key={i}
                className={`w-10 h-10 rounded-full transition-all duration-200 ${
                  selectedColor === color
                    ? 'ring-4 ring-offset-2 ring-[#ff7b5c] scale-110'
                    : 'hover:scale-110'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>取消</Button>
          <Button onClick={handleSelect}>确认选择</Button>
        </div>
      </div>
    </div>
  )
}