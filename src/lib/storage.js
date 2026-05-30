import { USERS_KEY, DATA_PREFIX, TEXTBOOK_PREFIX, EBBINGHAUS_STAGES } from '@/data/constants'

// ---- User Meta ----

export function getUsersMeta() {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    if (raw) {
      const d = JSON.parse(raw)
      if (d.users && d.activeUserId) return d
    }
  } catch (e) { /* ignore */ }
  return null
}

export function saveUsersMeta(meta) {
  localStorage.setItem(USERS_KEY, JSON.stringify(meta))
}

export function getActiveUserId() {
  const meta = getUsersMeta()
  return meta ? meta.activeUserId : null
}

export function getUserStorageKey(userId) {
  return DATA_PREFIX + userId
}

export function getTextbookStorageKey(userId) {
  return TEXTBOOK_PREFIX + userId
}

export function migrateToMultiUser() {
  if (getUsersMeta()) return

  const legacyRaw = localStorage.getItem('vocab_champion')
  if (legacyRaw) {
    const id = 'user_' + Date.now()
    const meta = {
      users: [{ id, name: '默认用户', createdAt: new Date().toISOString() }],
      activeUserId: id,
    }
    saveUsersMeta(meta)
    localStorage.setItem(getUserStorageKey(id), legacyRaw)
    // Also migrate legacy textbooks
    const legacyTb = localStorage.getItem('vocab_champion_textbooks')
    if (legacyTb) {
      localStorage.setItem(getTextbookStorageKey(id), legacyTb)
      localStorage.removeItem('vocab_champion_textbooks')
    }
    localStorage.removeItem('vocab_champion')
    return
  }

  // Fresh start
  const id = 'user_' + Date.now()
  const meta = {
    users: [{ id, name: '默认用户', createdAt: new Date().toISOString() }],
    activeUserId: id,
  }
  saveUsersMeta(meta)
}

// ---- User Management ----

export function switchUser(userId) {
  const meta = getUsersMeta()
  if (!meta) return
  const user = meta.users.find(u => u.id === userId)
  if (!user) return
  meta.activeUserId = userId
  saveUsersMeta(meta)
}

export function addUser(name) {
  const meta = getUsersMeta()
  if (!meta) return null
  const id = 'user_' + Date.now()
  meta.users.push({ id, name, createdAt: new Date().toISOString() })
  saveUsersMeta(meta)
  return id
}

export function deleteUser(userId) {
  const meta = getUsersMeta()
  if (!meta) return false
  if (meta.users.length <= 1) return false // keep at least one user
  meta.users = meta.users.filter(u => u.id !== userId)
  if (meta.activeUserId === userId) {
    meta.activeUserId = meta.users[0].id
  }
  // Clean up data
  localStorage.removeItem(getUserStorageKey(userId))
  localStorage.removeItem(getTextbookStorageKey(userId))
  saveUsersMeta(meta)
  return true
}

export function renameUser(userId, newName) {
  const meta = getUsersMeta()
  if (!meta) return
  const user = meta.users.find(u => u.id === userId)
  if (!user) return
  user.name = newName
  saveUsersMeta(meta)
}

export function setUserAvatar(userId, avatarData) {
  const meta = getUsersMeta()
  if (!meta) return
  const user = meta.users.find(u => u.id === userId)
  if (!user) return
  user.avatarEmoji = avatarData.emoji
  user.avatarColor = avatarData.color
  saveUsersMeta(meta)
}

// ---- Word Bank Data ----

export function loadData() {
  const uid = getActiveUserId()
  if (!uid) return { words: [], errors: {} }
  const key = getUserStorageKey(uid)
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw)
  } catch (e) { /* ignore */ }
  return { words: [], errors: {} }
}

export function saveData(data) {
  const uid = getActiveUserId()
  if (!uid) return
  localStorage.setItem(getUserStorageKey(uid), JSON.stringify(data))
}

export function getWordBank() {
  const data = loadData()
  return data.words || []
}

export function getErrors() {
  const data = loadData()
  return data.errors || {}
}

// ---- Word Mutations ----

export function saveWordToBank(word) {
  const data = loadData()
  const words = data.words || []

  // Check for duplicate
  const idx = words.findIndex(w => w.en.toLowerCase() === word.en.toLowerCase())
  if (idx >= 0) {
    words[idx] = { ...words[idx], ...word }
  } else {
    words.push({
      en: word.en,
      zh: word.zh || '',
      def: word.def || '',
      phonetic: word.phonetic || '',
      pos: word.pos || '',
      stage: 0,
      lastReview: null,
      nextReview: null,
      errorCount: 0,
      totalAttempts: 0,
      addedAt: Date.now(),
      ...word,
    })
  }

  saveData({ ...data, words })
}

export function updateWordProgress(en, correct) {
  const data = loadData()
  const words = data.words || []
  const errors = data.errors || {}
  const word = words.find(w => w.en.toLowerCase() === en.toLowerCase())
  if (!word) return

  word.totalAttempts = (word.totalAttempts || 0) + 1
  if (correct) {
    // Advance Ebbinghaus stage
    if (word.stage < EBBINGHAUS_STAGES.length - 1) {
      word.stage++
    }
  } else {
    // Reset to stage 0
    word.stage = 0
    word.errorCount = (word.errorCount || 0) + 1
    errors[en] = (errors[en] || 0) + 1
  }

  const now = Date.now()
  word.lastReview = now
  const stageVal = EBBINGHAUS_STAGES[word.stage]
  if (stageVal === 'mastered') {
    word.nextReview = 0
  } else {
    word.nextReview = now + stageVal * 1000
  }

  saveData({ ...data, words, errors })
}

// ---- Textbook Data ----

export function getTextbooksData() {
  const uid = getActiveUserId()
  if (!uid) return { textbooks: [] }
  const key = getTextbookStorageKey(uid)
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw)
  } catch (e) { /* ignore */ }
  return { textbooks: [] }
}

export function saveTextbooksData(data) {
  const uid = getActiveUserId()
  if (!uid) return
  localStorage.setItem(getTextbookStorageKey(uid), JSON.stringify(data))
}
