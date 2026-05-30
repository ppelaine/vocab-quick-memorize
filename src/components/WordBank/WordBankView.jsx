import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { useApp } from '@/context/AppContext'
import useWordBank from '@/hooks/useWordBank'
import StatsRow from './StatsRow'
import FilterBar from './FilterBar'
import WordList from './WordList'
import EmptyState from './EmptyState'
import AddWordModal from './AddWordModal'

export default function WordBankView() {
  const { toast } = useApp()
  const {
    filteredWords, errors, stats, filter, setFilter,
    addWord, deleteWord, clearAll, importSamples,
  } = useWordBank()

  const [showAddModal, setShowAddModal] = useState(false)

  const handleClearAll = () => {
    if (filteredWords.length === 0) {
      toast('词库已经是空的', 'error')
      return
    }
    clearAll()
    toast('词库已清空')
  }

  const handleDelete = (en) => {
    deleteWord(en)
    toast(`已删除: ${en}`)
  }

  return (
    <div className="animate-fade-in space-y-4">
      <StatsRow stats={stats} />

      <Card>
        <CardContent>
          <h2 className="text-xl font-extrabold mb-3 flex items-center gap-2">📋 我的单词本</h2>
          <FilterBar
            activeFilter={filter}
            onFilterChange={setFilter}
            onClearAll={handleClearAll}
          />

          {filteredWords.length > 0 ? (
            <WordList
              words={filteredWords}
              errors={errors}
              onDelete={handleDelete}
            />
          ) : (
            <EmptyState
              onAddWord={() => setShowAddModal(true)}
              onImportSamples={() => { importSamples(); toast('已导入示例词汇') }}
            />
          )}
        </CardContent>
      </Card>

      {filteredWords.length > 0 && (
        <div className="flex gap-2">
          <button
            className="h-9 px-[18px] rounded-[22px] bg-[#8b6fc0] text-white text-sm font-bold shadow-[0_4px_12px_rgba(139,111,192,.3)] hover:bg-[#7d5fb5] hover:-translate-y-0.5 transition-all"
            style={{ transitionDuration: '250ms', transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            onClick={() => setShowAddModal(true)}
          >
            + 手动添加单词
          </button>
          <button
            className="h-9 px-[18px] rounded-[22px] border-2 border-[#ff7b5c] text-[#ff7b5c] bg-transparent text-sm font-bold hover:bg-[#fff0eb] hover:-translate-y-0.5 transition-all"
            style={{ transitionDuration: '250ms', transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            onClick={() => { importSamples(); toast('已导入示例词汇') }}
          >
            📥 导入示例词汇
          </button>
        </div>
      )}

      <AddWordModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={addWord}
      />
    </div>
  )
}
