import { useMemo } from 'react'

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']
const MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

export default function StreakCalendar({ days }) {
  const months = useMemo(() => {
    const result = []
    let currentMonth = null
    let currentMonthDays = []

    days.forEach(day => {
      const date = new Date(day.date)
      const month = date.getMonth()
      const year = date.getFullYear()
      
      if (currentMonth !== `${year}-${month}`) {
        if (currentMonthDays.length > 0) {
          result.push({ month: currentMonth, days: currentMonthDays })
        }
        currentMonth = `${year}-${month}`
        currentMonthDays = []
      }
      
      currentMonthDays.push({
        ...day,
        dayOfMonth: date.getDate(),
        dayOfWeek: date.getDay()
      })
    })

    if (currentMonthDays.length > 0) {
      result.push({ month: currentMonth, days: currentMonthDays })
    }

    return result.slice(-6)
  }, [days])

  const getDayClass = (day, index) => {
    const base = 'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200'
    
    if (!day) return `${base} bg-transparent`
    
    if (day.active) {
      return `${base} bg-gradient-to-br from-[#ff7b5c] to-[#f4b843] text-white shadow-md hover:scale-110`
    }
    
    const date = new Date(day.date)
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()
    
    if (isToday) {
      return `${base} border-2 border-[#ff7b5c] text-[#ff7b5c]`
    }
    
    return `${base} bg-[#f5f2eb] text-[#9a948c]`
  }

  const getStreakCount = () => {
    let streak = 0
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].active) streak++
      else break
    }
    return streak
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-2 min-w-max">
        {months.map((m, mi) => {
          const [year, month] = m.month.split('-')
          return (
            <div key={mi} className="flex flex-col items-center">
              <div className="text-xs font-bold text-[#9a948c] mb-2">
                {MONTHS[parseInt(month)]}
              </div>
              <div className="grid grid-cols-7 gap-0.5">
                {WEEKDAYS.map((w, wi) => (
                  <div key={wi} className="w-6 h-6 flex items-center justify-center text-[8px] text-[#d8d0c0] font-bold">
                    {w}
                  </div>
                ))}
                {Array.from({ length: m.days[0]?.dayOfWeek || 0 }).map((_, i) => (
                  <div key={`empty-${mi}-${i}`} className="w-6 h-6" />
                ))}
                {m.days.map((day, di) => (
                  <div
                    key={di}
                    className={getDayClass(day, di)}
                    title={day.active ? `✓ ${day.date}` : day.date}
                  >
                    {day.dayOfMonth}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-[#f0ebe0]">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#ff7b5c] to-[#f4b843]" />
          <span className="text-xs text-[#9a948c]">已学习</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#f5f2eb] border border-[#e0d8c0]" />
          <span className="text-xs text-[#9a948c]">未学习</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-[#ff7b5c]" />
          <span className="text-xs text-[#9a948c]">今天</span>
        </div>
      </div>
    </div>
  )
}