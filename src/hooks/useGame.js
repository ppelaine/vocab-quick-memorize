import { useState, useCallback, useMemo } from 'react'
import { getWordBank, getErrors, updateWordProgress, getTextbooksData } from '@/lib/storage'

const SCOPE_RANGES = { today: 1, '3days': 3, '7days': 7, '30days': 30 }

function filterByTimeScope(words, scope) {
  if (scope === 'all') return words
  const days = SCOPE_RANGES[scope]
  if (!days) return words
  const cutoff = Date.now() - days * 86400 * 1000
  return words.filter(w => (w.addedAt || 0) >= cutoff)
}

function filterByTextbookScope(words, scopeConfig) {
  const { tbIdx, unitIdxs } = scopeConfig
  const textbooks = getTextbooksData().textbooks || []
  const tb = textbooks[tbIdx]
  if (!tb || !tb.u || unitIdxs.length === 0) return []
  
  const targetWords = new Set()
  unitIdxs.forEach(ui => {
    const unit = tb.u[ui]
    if (unit?.w) {
      unit.w.forEach(w => targetWords.add(w.en.toLowerCase()))
    }
  })
  
  return words.filter(w => targetWords.has(w.en.toLowerCase()))
}

function calcScore(w, errors, now) {
  let score = 0
  if (errors[w.en]) score += errors[w.en] * 5
  const nextReview = w.nextReview ? new Date(w.nextReview).getTime() : 0
  if (nextReview <= now && (w.stage || 0) < 7) score += 3
  if (!w.totalAttempts) score += 1
  score -= (w.stage || 0) * 0.5
  return score
}

function scoreWords(words) {
  const errors = getErrors()
  const now = Date.now()
  return words.map(w => ({ ...w, _score: calcScore(w, errors, now) }))
    .sort((a, b) => b._score - a._score)
}

function getDistractors(correct, pool, n) {
  return pool.filter(w => w.en.toLowerCase() !== correct.en.toLowerCase())
    .sort(() => Math.random() - 0.5).slice(0, n)
}

function blankWordMixed(word) {
  if (word.length <= 2) return word
  const chars = word.split('')
  const vowels = [], consonants = []
  for (let i = 0; i < chars.length; i++) {
    if (/[aeiou]/i.test(chars[i])) vowels.push(i)
    else if (/[a-z]/i.test(chars[i])) consonants.push(i)
  }
  const targetVowelCount = Math.max(0, Math.floor(vowels.length * 0.8))
  const targetConsonantCount = Math.max(0, Math.floor(consonants.length * 0.2))
  const toBlank = new Set()
  const shuffledV = [...vowels].sort(() => Math.random() - 0.5).slice(0, targetVowelCount)
  const shuffledC = [...consonants].sort(() => Math.random() - 0.5).slice(0, targetConsonantCount)
  shuffledV.forEach(i => toBlank.add(i))
  shuffledC.forEach(i => toBlank.add(i))
  const visibleCount = chars.length - toBlank.size
  if (visibleCount < 2) {
    const excess = [...toBlank].sort(() => Math.random() - 0.5)
    for (let i = 0; i < 2 - visibleCount && i < excess.length; i++) toBlank.delete(excess[i])
  }
  return chars.map((c, i) => toBlank.has(i) ? '_' : c).join('')
}

export default function useGame() {
  const [phase, setPhase] = useState('setup')
  const [mode, setMode] = useState(1)
  const [scope, setScope] = useState('all')
  const [pool, setPool] = useState([])
  const [current, setCurrent] = useState(0)
  const [total, setTotal] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [wrongWords, setWrongWords] = useState([])
  const [answers, setAnswers] = useState([])
  const [showHint, setShowHint] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)

  const progress = useMemo(() => total > 0 ? Math.round(current / total * 100) : 0, [current, total])
  const scorePct = useMemo(() => total > 0 ? Math.round(correct / total * 100) : 0, [correct, total])
  const currentWord = useMemo(() => pool[current] || null, [pool, current])

  const getOptions = useCallback(() => {
    if (!currentWord) return []
    const fullBank = getWordBank()
    const distractors = getDistractors(currentWord, fullBank, 3)
    return [currentWord, ...distractors].sort(() => Math.random() - 0.5)
  }, [currentWord])

  const getBlankedWord = useCallback(() => {
    if (!currentWord) return ''
    return blankWordMixed(currentWord.en)
  }, [currentWord])

  const getWrongWordDetails = useCallback(() => {
    const bank = getWordBank()
    return wrongWords.map(en => bank.find(w => w.en.toLowerCase() === en.toLowerCase()) || { en, zh: '' })
  }, [wrongWords])

  const startGame = useCallback((gameMode, scopeConfig = { type: 'time', timeScope: 'all' }) => {
    setMode(gameMode)
    setShowHint(false)
    setSelectedAnswer(null)

    const allWords = getWordBank()
    let filtered
    
    if (scopeConfig.type === 'textbook') {
      filtered = filterByTextbookScope(allWords, scopeConfig)
    } else {
      filtered = filterByTimeScope(allWords, scopeConfig.timeScope || scope)
    }
    
    if (filtered.length < 4) return 'not_enough'

    const scored = scoreWords(filtered)
    const topN = Math.min(12, scored.length)
    const top = scored.slice(0, topN)
    const rest = scored.slice(topN)
    const shuffledRest = rest.sort(() => Math.random() - 0.5).slice(0, Math.min(8, rest.length))
    const gamePool = [...top, ...shuffledRest].sort(() => Math.random() - 0.5)

    setPool(gamePool)
    setCurrent(0)
    setTotal(Math.min(20, gamePool.length))
    setCorrect(0)
    setWrong(0)
    setWrongWords([])
    setAnswers([])
    setPhase('play')
    return 'ok'
  }, [scope])

  const processAnswer = useCallback((isCorrect, en) => {
    setSelectedAnswer(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) {
      setCorrect(c => c + 1)
    } else {
      setWrong(c => c + 1)
      setWrongWords(prev => prev.includes(en) ? prev : [...prev, en])
    }
    setAnswers(prev => [...prev, { en, correct: isCorrect }])
    updateWordProgress(en, isCorrect)
  }, [])

  const nextQuestion = useCallback(() => {
    setShowHint(false)
    setSelectedAnswer(null)
    const next = current + 1
    if (next >= total) {
      setPhase('result')
    } else {
      setCurrent(next)
    }
  }, [current, total])

  const backToMenu = useCallback(() => {
    setPhase('setup')
    setPool([])
    setCurrent(0)
    setTotal(0)
    setCorrect(0)
    setWrong(0)
    setWrongWords([])
    setAnswers([])
    setShowHint(false)
    setSelectedAnswer(null)
  }, [])

  return {
    phase, mode, scope, current, total,
    correct, wrong, wrongWords, answers,
    progress, scorePct, currentWord,
    showHint, selectedAnswer,
    setScope, setShowHint,
    startGame, processAnswer, nextQuestion, backToMenu,
    getOptions, getBlankedWord, getWrongWordDetails,
  }
}
