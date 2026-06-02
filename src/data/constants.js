// Ebbinghaus spaced repetition intervals (in seconds)
export const EBBINGHAUS_STAGES = [
  300,        // 5 min
  1800,       // 30 min
  43200,      // 12 h
  86400,      // 1 day
  172800,     // 2 days
  345600,     // 4 days
  604800,     // 7 days
  'mastered', // final stage
]

export const STAGE_LABELS = {
  new: { label: '新词', cls: 'badge-new' },
  learning: { label: '学习中', cls: 'badge-learning' },
  review: { label: '待复习', cls: 'badge-review' },
  mastered: { label: '已掌握', cls: 'badge-mastered' },
}

// localStorage keys (MUST match legacy app for data compatibility)
export const USERS_KEY = 'vocab_champion_users'
export const DATA_PREFIX = 'vocab_champion_data_'
export const TEXTBOOK_PREFIX = 'vocab_champion_textbooks_'

