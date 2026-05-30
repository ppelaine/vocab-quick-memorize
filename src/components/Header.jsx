import { useState } from 'react'
import { useApp } from '@/context/AppContext'

export default function Header({ children }) {
  const { user } = useApp()
  const [showModal, setShowModal] = useState(false)
  const [newName, setNewName] = useState('')

  const handleSwitch = (userId) => {
    user.switchTo(userId)
  }

  const handleAdd = () => {
    if (!newName.trim()) return
    user.add(newName.trim())
    setNewName('')
  }

  const handleDelete = (userId) => {
    if (!user.remove(userId)) {
      // toast handled by parent if needed
    }
  }

  return (
    <>
      <header
        className="sticky top-0 z-50 px-3 sm:px-7 py-2.5 sm:py-[18px] flex items-center justify-between flex-wrap gap-1.5 sm:gap-3.5 text-white"
        style={{
          background: 'linear-gradient(135deg, #ff7b5c 0%, #f4875e 25%, #f4b843 60%, #8b6fc0 100%)',
          boxShadow: '0 2px 20px rgba(139, 111, 192, 0.25)',
        }}
      >
        <div className="min-w-0">
          <h1 className="text-base sm:text-2xl font-extrabold tracking-tight [text-shadow:0_1px_3px_rgba(0,0,0,.08)]">
            📚 单词快快记
          </h1>
          <p className="text-xs sm:text-sm opacity-85 font-semibold mt-0.5 hidden sm:block">
            基于艾宾浩斯遗忘曲线 · 拍照上传/教材搜索 · 游戏模式
          </p>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-md"
              style={{ backgroundColor: user.activeUser?.avatarColor || '#ff7b5c' }}
            >
              {user.activeUser?.avatarEmoji || '👤'}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs sm:text-sm font-bold truncate max-w-[80px]">{user.activeUser?.name || '用户'}</div>
            </div>
            <button
              className="px-2 sm:px-3.5 py-1 rounded-2xl border-2 border-white/40 bg-white/20 text-white text-[10px] sm:text-xs font-bold hover:bg-white/35 hover:scale-105 transition-all duration-200"
              onClick={() => setShowModal(true)}
            >
              切换
            </button>
          </div>
          {children}
        </div>
      </header>

      {/* User Management Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}
        >
          <div className="bg-white rounded-2xl p-6 max-w-[420px] w-[92%] max-h-[80vh] overflow-y-auto shadow-[0_8px_40px_rgba(0,0,0,.08)] animate-modal-in">
            <h3 className="font-extrabold text-lg mb-4">👥 用户管理</h3>

            {/* Current users */}
            <div className="space-y-2 mb-4 max-h-[200px] overflow-y-auto">
              {user.users.map(u => (
                <div
                  key={u.id}
                  className={`flex items-center justify-between py-2 px-3 rounded-xl border-2 transition-all duration-200 ${
                    u.id === user.activeUserId
                      ? 'border-[#ff7b5c] bg-[#fff0eb]'
                      : 'border-[#f0ebe0] bg-white hover:border-[#e0d8c0]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#2d2a28]">{u.name}</span>
                    {u.id === user.activeUserId && (
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-[#ff7b5c] text-white">当前</span>
                    )}
                  </div>
                  <div className="flex gap-1.5">
                    {u.id !== user.activeUserId && (
                      <button
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#58b368] text-white hover:bg-[#4a9f5a] transition-colors"
                        onClick={() => { handleSwitch(u.id); setShowModal(false) }}
                      >
                        切换
                      </button>
                    )}
                    {user.users.length > 1 && (
                      <button
                        className="px-2 py-1 rounded-lg text-xs font-bold border border-[#f2675a] text-[#f2675a] bg-transparent hover:bg-[#fef0ee] transition-colors"
                        onClick={() => handleDelete(u.id)}
                      >
                        删除
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add new user */}
            <div className="flex gap-2">
              <input
                className="flex-1 h-10 px-3 rounded-xl border-2 border-[#e8e0d0] text-sm font-semibold focus:outline-none focus:border-[#ff7b5c]"
                placeholder="新用户名"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAdd() }}
              />
              <button
                className="px-4 py-1 rounded-xl text-sm font-bold bg-[#ff7b5c] text-white hover:bg-[#f2675a] transition-colors"
                onClick={handleAdd}
              >
                + 添加
              </button>
            </div>

            <div className="flex justify-end mt-4">
              <button
                className="px-3 py-1.5 rounded-xl text-xs font-bold border-2 border-[#e0d8c0] text-[#9a948c] bg-transparent hover:border-[#ff7b5c] transition-all duration-200"
                onClick={() => setShowModal(false)}
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
