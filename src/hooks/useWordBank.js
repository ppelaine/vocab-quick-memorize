import { useState, useCallback, useMemo, useEffect } from 'react'
import { loadData, saveData, saveWordToBank as saveWord, updateWordProgress as updateProgress, getWordBank, getErrors } from '@/lib/storage'
import { getWordStatus, calculateAccuracy, getErrorCount } from '@/lib/ebbinghaus'
import DICTIONARY from '@/data/dictionary'

export default function useWordBank() {
  const [data, setData] = useState(() => loadData())

  // Reload data when user switches
  useEffect(() => {
    const handler = () => setData(loadData())
    window.addEventListener('user-changed', handler)
    return () => window.removeEventListener('user-changed', handler)
  }, [])
  const [filter, setFilter] = useState('all')

  const words = useMemo(() => data.words || [], [data])
  const errors = useMemo(() => data.errors || {}, [data])

  const stats = useMemo(() => {
    const now = Date.now()
    let total = words.length
    let learning = 0, review = 0, mastered = 0, newCount = 0
    const errorCount = Object.keys(errors).length

    for (const w of words) {
      const status = getWordStatus(w, now)
      if (status === 'new') newCount++
      else if (status === 'learning') learning++
      else if (status === 'review') review++
      else if (status === 'mastered') mastered++
    }

    return { total, newCount, learning, review, mastered, errorCount }
  }, [words, errors])

  const filteredWords = useMemo(() => {
    const now = Date.now()
    switch (filter) {
      case 'new': return words.filter(w => getWordStatus(w, now) === 'new')
      case 'learning': return words.filter(w => getWordStatus(w, now) === 'learning')
      case 'review': return words.filter(w => getWordStatus(w, now) === 'review')
      case 'mastered': return words.filter(w => getWordStatus(w, now) === 'mastered')
      case 'errors': return words.filter(w => errors[w.en])
      default: return words
    }
  }, [words, filter, errors])

  const reload = useCallback(() => setData(loadData()), [])

  const addWord = useCallback((word) => {
    saveWord(word)
    reload()
  }, [reload])

  const deleteWord = useCallback((en) => {
    const d = loadData()
    const words = (d.words || []).filter(w => w.en.toLowerCase() !== en.toLowerCase())
    saveData({ ...d, words })
    reload()
  }, [reload])

  const clearAll = useCallback(() => {
    saveData({ words: [], errors: {} })
    reload()
  }, [reload])

  const importSamples = useCallback(() => {
    const d = loadData()
    const existing = new Set((d.words || []).map(w => w.en.toLowerCase()))
    const newWords = DICTIONARY
      .filter(entry => !existing.has(entry.en.toLowerCase()))
      .map(entry => ({
        en: entry.en,
        zh: entry.zh,
        def: entry.def || '',
        phonetic: entry.phonetic || '',
        pos: entry.pos || '',
        stage: 0,
        lastReview: null,
        nextReview: null,
        errorCount: 0,
        totalAttempts: 0,
        addedAt: Date.now(),
      }))
    saveData({ ...d, words: [...(d.words || []), ...newWords] })
    reload()
  }, [reload])

  const recordAnswer = useCallback((en, correct) => {
    updateProgress(en, correct)
    reload()
  }, [reload])

  return {
    words,
    filteredWords,
    errors,
    stats,
    filter,
    setFilter,
    addWord,
    deleteWord,
    clearAll,
    importSamples,
    recordAnswer,
    reload,
    getWordStatus,
    calculateAccuracy,
    getErrorCount: (en) => getErrorCount(errors, en),
  }
}
