import { Card } from '@/components/ui/card'

const STAT_CONFIG = [
  { key: 'total', label: '总词汇', color: '#ff7b5c', icon: '📚' },
  { key: 'review', label: '待复习', color: '#f4b843', icon: '⏰' },
  { key: 'errorCount', label: '错词集', color: '#f2675a', icon: '❌' },
  { key: 'mastered', label: '已掌握', color: '#58b368', icon: '✅' },
]

export default function StatsRow({ stats }) {
  if (!stats) return null

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {STAT_CONFIG.map((s, i) => (
        <Card
          key={i}
          className="text-center py-4 px-3 border-2 border-transparent hover:border-[#fff0eb] hover:-translate-y-[3px]"
          style={{ transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        >
          <div className="text-3xl sm:text-4xl font-black" style={{ color: s.color }}>
            {stats[s.key] ?? 0}
          </div>
          <div className="text-xs sm:text-sm text-[#9a948c] mt-1 font-semibold">
            {s.icon} {s.label}
          </div>
        </Card>
      ))}
    </div>
  )
}
