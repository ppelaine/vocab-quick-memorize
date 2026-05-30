import { useState, useCallback, useMemo, useEffect } from 'react'
import { getTextbooksData, saveTextbooksData } from '@/lib/storage'
import genTextbookDB from '@/data/genTextbookDB'

let _textbookDB = null
function getTextbookDB() {
  if (!_textbookDB) {
    try { _textbookDB = genTextbookDB() } catch (e) { _textbookDB = [] }
  }
  return _textbookDB
}

export default function useTextbooks() {
  const [data, setData] = useState(() => getTextbooksData())

  // Reload data when user switches
  useEffect(() => {
    const handler = () => setData(getTextbooksData())
    window.addEventListener('user-changed', handler)
    return () => window.removeEventListener('user-changed', handler)
  }, [])
  const [query, setQuery] = useState('')
  const [selectedIdx, setSelectedIdx] = useState(null)
  const [selectedUnitIdx, setSelectedUnitIdx] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalTab, setModalTab] = useState('add') // add | manage

  const textbooks = useMemo(() => {
    let list = data.textbooks || []
    if (list.length === 0) {
      const db = getTextbookDB()
      if (db && db.length) list = JSON.parse(JSON.stringify(db))
    }
    return list
  }, [data])

  const searchResults = useMemo(() => {
    if (!query.trim()) return textbooks
    const q = query.toLowerCase().trim()
    return textbooks.filter(tb => {
      if ((tb.n || '').toLowerCase().includes(q)) return true
      if ((tb.p || '').toLowerCase().includes(q)) return true
      if ((tb.g || '').toLowerCase().includes(q)) return true
      if (tb.a) for (const a of tb.a) { if (a.toLowerCase().includes(q)) return true }
      if (tb.u) for (const u of tb.u) { if (u.n && u.n.toLowerCase().includes(q)) return true }
      return false
    })
  }, [textbooks, query])

  const selectedTb = useMemo(() => {
    if (selectedIdx === null || selectedIdx >= textbooks.length) return null
    return textbooks[selectedIdx]
  }, [textbooks, selectedIdx])

  const selectedUnit = useMemo(() => {
    if (!selectedTb || selectedUnitIdx === null) return null
    const units = Array.isArray(selectedTb.u) ? selectedTb.u : []
    return units[selectedUnitIdx] || null
  }, [selectedTb, selectedUnitIdx])

  const reload = useCallback(() => setData(getTextbooksData()), [])

  const selectTextbook = useCallback((idx) => {
    setSelectedIdx(idx)
    setSelectedUnitIdx(null)
    setQuery('')
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedIdx(null)
    setSelectedUnitIdx(null)
    setQuery('')
  }, [])

  const addCustomTextbook = useCallback((name, publisher = '', grade = '') => {
    const d = getTextbooksData()
    d.textbooks.push({ n: name, p: publisher, g: grade, a: [], u: [] })
    saveTextbooksData(d)
    reload()
  }, [reload])

  const deleteTextbook = useCallback((idx) => {
    const d = getTextbooksData()
    d.textbooks.splice(idx, 1)
    saveTextbooksData(d)
    reload()
    if (selectedIdx === idx) clearSelection()
  }, [reload, selectedIdx, clearSelection])

  const addUnitToTextbook = useCallback((tbIdx, unitName) => {
    const d = getTextbooksData()
    const tb = d.textbooks[tbIdx]
    if (!tb) return
    if (!Array.isArray(tb.u)) tb.u = []
    tb.u.push({ n: unitName, w: [] })
    saveTextbooksData(d)
    reload()
  }, [reload])

  const deleteUnit = useCallback((tbIdx, unitIdx) => {
    const d = getTextbooksData()
    const tb = d.textbooks[tbIdx]
    if (!tb || !tb.u) return
    tb.u.splice(unitIdx, 1)
    saveTextbooksData(d)
    reload()
  }, [reload])

  const setUnitWords = useCallback((tbIdx, unitIdx, words) => {
    const d = getTextbooksData()
    const tb = d.textbooks[tbIdx]
    if (!tb || !tb.u || !tb.u[unitIdx]) return
    tb.u[unitIdx].w = words
    saveTextbooksData(d)
    reload()
  }, [reload])

  const pasteWordsToUnit = useCallback((tbIdx, unitIdx, text) => {
    // Parse pasted text: "english chinese" pairs, one per line or tab-separated
    const lines = text.split(/[\n\r]+/).filter(l => l.trim())
    const words = []
    for (const line of lines) {
      const parts = line.split(/[\t,，、]{1,}/).map(p => p.trim()).filter(Boolean)
      if (parts.length >= 2) {
        const en = parts[0]
        const zh = parts[1]
        if (/^[a-zA-Z]/.test(en)) words.push({ en, zh, phonetic: '', pos: '' })
      }
    }
    if (words.length > 0) {
      const d = getTextbooksData()
      const tb = d.textbooks[tbIdx]
      if (tb && tb.u && tb.u[unitIdx]) {
        tb.u[unitIdx].w = words
        saveTextbooksData(d)
        reload()
      }
    }
    return words.length
  }, [reload])

  return {
    textbooks, searchResults, query, setQuery,
    selectedIdx, selectedTb, selectedUnitIdx, setSelectedUnitIdx,
    selectedUnit, showModal, setShowModal, modalTab, setModalTab,
    selectTextbook, clearSelection,
    addCustomTextbook, deleteTextbook,
    addUnitToTextbook, deleteUnit,
    setUnitWords, pasteWordsToUnit,
    reload,
  }
}
