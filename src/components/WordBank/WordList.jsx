import WordRow from './WordRow'

export default function WordList({ words, errors, onDelete }) {
  if (!words || words.length === 0) return null

  return (
    <div className="max-h-[420px] overflow-y-auto scroll-smooth" style={{ borderTop: '1px solid #f0ebe0' }}>
      {words.map((w, i) => (
        <div key={w.en + i} style={{ borderBottom: '1px solid #f0ebe0' }}>
          <WordRow word={w} errors={errors} onDelete={onDelete} />
        </div>
      ))}
    </div>
  )
}
