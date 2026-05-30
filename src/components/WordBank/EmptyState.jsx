import { Button } from '@/components/ui/button'

export default function EmptyState({ onAddWord, onImportSamples }) {
  return (
    <div className="text-center py-12 text-[#9a948c]">
      <span className="text-5xl block mb-3 animate-float">📭</span>
      <p className="font-bold text-lg text-[#2d2a28]">词库还是空的！</p>
      <p className="text-sm mb-4">去「📷 上传」拍照导入单词，或点击下方按钮添加</p>
      <div className="flex gap-2 justify-center flex-wrap">
        <Button variant="secondary" onClick={onAddWord}>
          + 手动添加单词
        </Button>
        <Button variant="outline" onClick={onImportSamples}>
          📥 导入示例词汇
        </Button>
      </div>
    </div>
  )
}
