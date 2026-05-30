import { EBBINGHAUS_STAGES, STAGE_LABELS } from '@/data/constants'

export function getWordStatus(word) {
  if (!word) return 'new'
  const now = Date.now()
  const stage = EBBINGHAUS_STAGES[word.stage || 0]

  if (stage === 'mastered') return 'mastered'

  if (!word.lastReview) return 'new'

  const nextReview = word.nextReview ? new Date(word.nextReview).getTime() : null
  if (nextReview && now >= nextReview) return 'review'
  if (word.stage > 0) return 'learning'

  return 'new'
}

export function isDue(word) {
  if (!word || !word.nextReview) return false
  return Date.now() >= new Date(word.nextReview).getTime()
}

export function calculateAccuracy(word) {
  if (!word || !word.totalAttempts || word.totalAttempts === 0) return 0
  const correct = word.totalAttempts - (word.errorCount || 0)
  return Math.round((correct / word.totalAttempts) * 100)
}

export function getErrorCount(errors, en) {
  if (!errors) return 0
  return errors[en] || 0
}

export function getStatusBadge(stage) {
  if (stage === 'mastered' || (typeof stage === 'number' && stage >= EBBINGHAUS_STAGES.length - 1)) {
    return { label: '已掌握', variant: 'mastered' }
  }
  if (typeof stage === 'number' && stage > 0) {
    return { label: '学习中', variant: 'learning' }
  }
  if (typeof stage === 'number' && stage === 0) {
    return { label: '新词', variant: 'new' }
  }
  return { label: '待复习', variant: 'review' }
}

export function getStatusLabel(status) {
  return STAGE_LABELS[status]?.label || status
}
