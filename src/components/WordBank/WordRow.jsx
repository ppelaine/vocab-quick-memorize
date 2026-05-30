import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getWordStatus, calculateAccuracy } from '@/lib/ebbinghaus'

export default function WordRow({ word, errors, onDelete }) {
  const status = getWordStatus(word)
  const accuracy = calculateAccuracy(word)
  const errCount = errors[word.en] || 0

  const badgeVariant = (() => {
    switch (status) {
      case 'mastered': return 'mastered'
      case 'review': return 'review'
      case 'learning': return 'learning'
      default: return 'new'
    }
  })()

  const badgeLabel = {
    new: '新词', learning: '学习中', review: '待复习', mastered: '已掌握',
  }[status] || '新词'

  return (
    <div
      className="flex items-center justify-between py-3 px-4 gap-2 flex-wrap rounded-[10px] my-0.5
        hover:bg-[#fef9f4] hover:translate-x-1 transition-all duration-200"
    >
      <div className="flex items-center gap-2 flex-wrap min-w-0">
        <span className="font-extrabold text-[#2d2a28] text-sm min-w-[90px]">{word.en}</span>
        {word.phonetic && (
          <span className="text-xs text-[#8b6fc0] font-semibold min-w-[70px] font-[Nunito,'Segoe_UI']">
            {word.phonetic}
          </span>
        )}
        {word.pos && (
          <span className="text-xs text-[#ff7b5c] font-extrabold min-w-[36px] bg-[#fff0eb] px-2 py-0.5 rounded-lg text-center">
            {word.pos}
          </span>
        )}
        <span className="text-sm text-[#9a948c] font-semibold min-w-[70px]">{word.zh}</span>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {accuracy > 0 && (
          <span className="text-xs text-[#b8b0a8] italic">
            {accuracy}%
          </span>
        )}
        {errCount > 0 && (
          <span className="text-xs text-[#f2675a] font-bold">{errCount}✕</span>
        )}
        <Badge variant={badgeVariant}>{badgeLabel}</Badge>
        <button
          className="bg-none border-none cursor-pointer text-xs text-[#f2675a] px-2.5 py-1 rounded-md font-bold hover:bg-[#fef0ee] hover:scale-110 transition-all duration-200"
          onClick={(e) => { e.stopPropagation(); onDelete(word.en) }}
        >
          ✕
        </button>
      </div>
    </div>
  )
}
