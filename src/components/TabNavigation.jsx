export default function TabNavigation({ tabs, activeTab, onTabChange }) {
  return (
    <div
      className="flex gap-0.5 sm:gap-1 rounded-3xl p-0.5 sm:p-1"
      style={{
        background: 'rgba(255,255,255,0.18)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            px-2.5 sm:px-[22px] py-1.5 sm:py-[9px] rounded-[22px] text-xs sm:text-sm font-bold
            transition-all whitespace-nowrap
            ${activeTab === tab.id
              ? 'bg-white text-[#ff6b42] font-extrabold shadow-[0_2px_8px_rgba(0,0,0,.1)] scale-[1.03]'
              : 'text-white/85 hover:bg-white/20 hover:scale-[1.02]'
            }
          `}
          style={{ transition: 'all 250ms cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        >
          <span className="sm:hidden">{tab.label}</span>
          <span className="hidden sm:inline">{tab.icon} {tab.label}</span>
        </button>
      ))}
    </div>
  )
}
