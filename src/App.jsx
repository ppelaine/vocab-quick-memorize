import Header from './components/Header'
import TabNavigation from './components/TabNavigation'
import ToastContainer from './components/ToastContainer'
import { AppProvider, useApp } from './context/AppContext'
import WordBankView from './components/WordBank/WordBankView'
import GameView from './components/Game/GameView'
import UploadView from './components/Upload/UploadView'
import ProfileView from './components/Profile/ProfileView'

const TABS = [
  { id: 'bank', label: '词库', icon: '📋' },
  { id: 'upload', label: '上传', icon: '📷' },
  { id: 'game', label: '游戏', icon: '🎮' },
  { id: 'profile', label: '我的', icon: '👤' },
]

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

function AppContent() {
  const { activeTab, setActiveTab, toast, toasts } = useApp()

  return (
    <div className="min-h-screen flex flex-col">
      <Header>
        <TabNavigation
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </Header>

      <main className="flex-1 max-w-[900px] mx-auto w-full px-4 sm:px-5 py-5 sm:py-6">
        {activeTab === 'bank' && <WordBankView />}

        {activeTab === 'upload' && <UploadView />}

        {activeTab === 'game' && <GameView />}

        {activeTab === 'profile' && <ProfileView />}
      </main>

      <ToastContainer toasts={toasts} />
    </div>
  )
}
