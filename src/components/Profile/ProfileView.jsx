import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useApp } from '@/context/AppContext'
import useWordBank from '@/hooks/useWordBank'
import StreakCalendar from './StreakCalendar'
import AvatarSelector from './AvatarSelector'

const AVATAR_COLORS = [
  '#ff7b5c', '#f4b843', '#58b368', '#8b6fc0', '#5b9bd5',
  '#ff9f7f', '#f7c568', '#7bc986', '#a58bd4', '#7ab8e3'
]

export default function ProfileView() {
  const { user, toast } = useApp()
  const { stats } = useWordBank()
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)

  const currentUser = user.activeUser

  const streakDays = getStreakDays()

  function getStreakDays() {
    const days = []
    const today = new Date()
    for (let i = 365; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      days.push({
        date: date.toISOString().split('T')[0],
        active: Math.random() > 0.6
      })
    }
    return days
  }

  const handleAvatarChange = (avatarData) => {
    user.setAvatar(avatarData)
    setShowAvatarModal(false)
    toast('头像已更新')
  }

  const handleNameChange = (newName) => {
    if (!newName.trim()) return
    user.rename(currentUser.id, newName.trim())
    toast('用户名已更新')
  }

  return (
    <div className="animate-fade-in space-y-4">
      {/* User Info Card */}
      <Card className="overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-[#ff7b5c] via-[#f4b843] to-[#8b6fc0]" />
        <CardContent className="relative -mt-12">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative">
              <div
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center text-white text-4xl font-black shadow-xl cursor-pointer hover:scale-105 transition-transform duration-300"
                style={{ backgroundColor: currentUser?.avatarColor || AVATAR_COLORS[0] }}
                onClick={() => setShowAvatarModal(true)}
              >
                {currentUser?.avatarEmoji || '👤'}
              </div>
              <button
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white border-2 border-[#ff7b5c] flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                onClick={() => setShowAvatarModal(true)}
              >
                ✏️
              </button>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-black text-[#2d2a28]">{currentUser?.name || '用户'}</h2>
                <button
                  className="p-1 rounded-lg hover:bg-[#f5f2eb] transition-colors"
                  onClick={() => setShowUserModal(true)}
                >
                  ✏️
                </button>
              </div>
              <p className="text-sm text-[#9a948c] mt-1">累计学习 {stats.total || 0} 个单词</p>
              <div className="flex gap-4 justify-center sm:justify-start mt-2">
                <div className="text-center">
                  <div className="text-lg font-black text-[#ff7b5c]">{streakDays.filter(d => d.active).length}</div>
                  <div className="text-xs text-[#9a948c]">学习天数</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-black text-[#f4b843]">7</div>
                  <div className="text-xs text-[#9a948c]">连续天数</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-black text-[#58b368]">{stats.mastered || 0}</div>
                  <div className="text-xs text-[#9a948c]">已掌握</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="text-center p-4">
          <div className="text-3xl font-black text-[#ff7b5c]">{stats.total || 0}</div>
          <div className="text-xs text-[#9a948c] mt-1">📚 总词汇</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-3xl font-black text-[#f4b843]">{stats.review || 0}</div>
          <div className="text-xs text-[#9a948c] mt-1">⏰ 待复习</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-3xl font-black text-[#8b6fc0]">{stats.learning || 0}</div>
          <div className="text-xs text-[#9a948c] mt-1">📖 学习中</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-3xl font-black text-[#58b368]">{stats.mastered || 0}</div>
          <div className="text-xs text-[#9a948c] mt-1">✅ 已掌握</div>
        </Card>
      </div>

      {/* Streak Calendar */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-extrabold text-lg">🔥 学习打卡</h3>
            <span className="text-xs text-[#f4b843] font-bold">连续 {7} 天</span>
          </div>
          <StreakCalendar days={streakDays} />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardContent>
          <h3 className="font-extrabold text-lg mb-3">⚡ 快速操作</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button className="p-3 rounded-xl bg-[#fff0eb] hover:bg-[#ffe5dc] transition-colors">
              <span className="text-2xl block">📷</span>
              <span className="text-xs font-bold text-[#ff7b5c]">拍照上传</span>
            </button>
            <button className="p-3 rounded-xl bg-[#f4f0fa] hover:bg-[#ebe5f5] transition-colors">
              <span className="text-2xl block">📚</span>
              <span className="text-xs font-bold text-[#8b6fc0]">教材导入</span>
            </button>
            <button className="p-3 rounded-xl bg-[#e8f5e9] hover:bg-[#dcf0de] transition-colors">
              <span className="text-2xl block">🎮</span>
              <span className="text-xs font-bold text-[#58b368]">开始游戏</span>
            </button>
            <button className="p-3 rounded-xl bg-[#fef8ed] hover:bg-[#f9efdb] transition-colors">
              <span className="text-2xl block">⏰</span>
              <span className="text-xs font-bold text-[#f4b843]">今日复习</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* User Management Button */}
      <div className="flex justify-center">
        <Button variant="outline" onClick={() => setShowUserModal(true)} className="w-full sm:w-auto">
          👥 管理用户
        </Button>
      </div>

      {/* Avatar Selector Modal */}
      <AvatarSelector
        open={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        onSelect={handleAvatarChange}
        currentAvatar={currentUser?.avatarEmoji}
        currentColor={currentUser?.avatarColor}
      />

      {/* User Management Modal */}
      {showUserModal && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
          onClick={e => { if (e.target === e.currentTarget) setShowUserModal(false) }}
        >
          <div className="bg-white rounded-2xl p-6 max-w-[420px] w-[92%] max-h-[80vh] overflow-y-auto shadow-[0_8px_40px_rgba(0,0,0,.08)] animate-modal-in">
            <h3 className="font-extrabold text-lg mb-4">👥 用户管理</h3>

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
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: u.avatarColor || AVATAR_COLORS[0] }}
                    >
                      {u.avatarEmoji || '👤'}
                    </div>
                    <span className="font-bold text-sm text-[#2d2a28]">{u.name}</span>
                    {u.id === user.activeUserId && (
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-[#ff7b5c] text-white">当前</span>
                    )}
                  </div>
                  <div className="flex gap-1.5">
                    {u.id !== user.activeUserId && (
                      <button
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#58b368] text-white hover:bg-[#4a9f5a] transition-colors"
                        onClick={() => { user.switchTo(u.id); setShowUserModal(false) }}
                      >
                        切换
                      </button>
                    )}
                    {user.users.length > 1 && (
                      <button
                        className="px-2 py-1 rounded-lg text-xs font-bold border border-[#f2675a] text-[#f2675a] bg-transparent hover:bg-[#fef0ee] transition-colors"
                        onClick={() => user.remove(u.id)}
                      >
                        删除
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <input
                className="w-full h-10 px-3 rounded-xl border-2 border-[#e8e0d0] text-sm font-semibold focus:outline-none focus:border-[#ff7b5c]"
                placeholder="修改当前用户名"
                defaultValue={currentUser?.name}
                onKeyDown={e => { if (e.key === 'Enter') handleNameChange(e.target.value) }}
              />
              <div className="flex gap-2">
                <input
                  className="flex-1 h-10 px-3 rounded-xl border-2 border-[#e8e0d0] text-sm font-semibold focus:outline-none focus:border-[#ff7b5c]"
                  placeholder="新用户名"
                  onKeyDown={e => { if (e.key === 'Enter') { user.add(e.target.value.trim()); e.target.value = '' } }}
                />
                <Button onClick={() => {
                  const input = document.querySelector('input[placeholder="新用户名"]')
                  if (input.value.trim()) { user.add(input.value.trim()); input.value = '' }
                }}>+ 添加</Button>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={() => setShowUserModal(false)}>关闭</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}