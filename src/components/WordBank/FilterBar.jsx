import { Button } from '@/components/ui/button'

const FILTERS = [
  { key: 'all', label: '全部' },
  { key: 'new', label: '🆕 新词' },
  { key: 'learning', label: '📖 学习中' },
  { key: 'review', label: '🔴 待复习' },
  { key: 'mastered', label: '✅ 已掌握' },
  { key: 'errors', label: '❌ 错词集' },
]

export default function FilterBar({ activeFilter, onFilterChange, onClearAll }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {FILTERS.map(f => (
        <Button
          key={f.key}
          variant={activeFilter === f.key ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange(f.key)}
        >
          {f.label}
        </Button>
      ))}
      <Button variant="destructive" size="sm" className="ml-auto" onClick={onClearAll}>
        清空词库
      </Button>
    </div>
  )
}
