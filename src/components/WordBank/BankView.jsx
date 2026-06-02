import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useApp } from '@/context/AppContext'
import useWordBank from '@/hooks/useWordBank'
import UploadView from '@/components/Upload/UploadView'
import AddWordModal from './AddWordModal'

export default function BankView() {
  const { toast } = useApp()
  const { addWord } = useWordBank()
  const [showAddModal, setShowAddModal] = useState(false)

  const handleSave = (word) => {
    addWord(word)
    setShowAddModal(false)
    toast(`已添加: ${word.en}`)
  }

  return (
    <div className="animate-fade-in space-y-4">
      {/* Manual Add Card */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-extrabold mb-2 flex items-center gap-2">
            ✏️ 手动添加单词
          </h2>
          <p className="text-sm text-[#9a948c] mb-3">
            输入英文单词，系统自动从词典填充释义、音标、词性等信息。
          </p>
          <Button onClick={() => setShowAddModal(true)}>
            + 添加单词
          </Button>
        </CardContent>
      </Card>

      <AddWordModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSave}
      />

      {/* Upload + Textbook section */}
      <UploadView />
    </div>
  )
}
