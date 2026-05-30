// Levenshtein edit distance
export function levenshtein(a, b) {
  if (!a.length) return b.length
  if (!b.length) return a.length
  const m = []
  for (let i = 0; i <= b.length; i++) { m[i] = [i] }
  for (let j = 0; j <= a.length; j++) { m[0][j] = j }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      m[i][j] = b[i - 1] === a[j - 1] ? m[i - 1][j - 1] : Math.min(m[i - 1][j - 1] + 1, m[i][j - 1] + 1, m[i - 1][j] + 1)
    }
  }
  return m[b.length][a.length]
}

// Common OCR error patterns
const OCR_FIXES = {
  'oclock': "o'clock", 'ted': 'ten', 'vear': 'wear', 'sed': 'bed', 'iazy': 'lazy',
  'reeze': 'freeze', 'lood': 'flood', 'iow': 'low', 'tshirt': 'T-shirt', 'fatherof': 'father of',
  'comer': 'corner', 'pround': 'pound', 'ofif': 'off',
}

// Fuzzy match a word against dictionary entries
export function fuzzyDictMatch(word, dictMap, dictEntries) {
  const lw = word.toLowerCase()
  // Apply known OCR fixes
  const fixed = OCR_FIXES[lw] || lw

  // Exact match after fixing
  if (dictMap[fixed]) return { match: dictMap[fixed], distance: 0, corrected: fixed }

  // Fuzzy search: only check entries with similar length and first char
  let best = null, bestDist = 99
  for (const [key, d] of dictEntries) {
    if (Math.abs(key.length - fixed.length) > 2) continue
    if (key[0] !== fixed[0]) continue
    const dist = levenshtein(fixed, key)
    if (dist < bestDist) { bestDist = dist; best = d }
    if (dist === 0) break
  }
  if (bestDist <= 2 && best) return { match: best, distance: bestDist, corrected: best.en.toLowerCase() }
  return { match: null, distance: 99, corrected: fixed }
}

// Validate if a string looks like a plausible English word
export function isPlausibleWord(w) {
  if (w.length < 2 || w.length > 25) return false
  if (!/[aeiou]/i.test(w)) return false
  if (/(.)\1\1/i.test(w)) return false
  if (!/^[a-zA-Z][a-zA-Z'-]*$/.test(w) && !/^[a-zA-Z][a-zA-Z'-]* [a-zA-Z]/.test(w)) return false
  if (/^[bcdfghjklmnpqrstvwxyz]$/i.test(w)) return false
  return true
}

// Detect multi-word terms from dictionary in raw OCR text
export function detectMultiWordTerms(text, dictEntries) {
  const found = new Set()
  const lowerText = text.toLowerCase()
  for (const [key] of dictEntries) {
    if (!key.includes(' ') && !key.includes('-')) continue
    if (lowerText.includes(key)) found.add(key)
  }
  return [...found]
}

// Build dictionary index for fast lookup
export function buildDictIndex(dictionary) {
  const map = {}
  const entries = []
  for (const d of dictionary) {
    const key = d.en.toLowerCase()
    map[key] = d
    entries.push([key, d])
  }
  return { map, entries }
}

// Detect unit boundaries from TOC OCR text
export function detectTOCStructure(text) {
  const units = []
  const lines = text.split(/\n/)
  let currentUnit = null
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    const unitMatch = line.match(/(?:UNIT|Unit|🔹\s*Unit)\s*(\d+)/i)
    if (unitMatch) {
      if (currentUnit) units.push(currentUnit)
      currentUnit = { num: parseInt(unitMatch[1]), header: line, words: [] }
      continue
    }
    const targetMatch = line.match(/(?:TARGET WORDS|目标词汇)[:\s]*(.+)/i)
    if (targetMatch && currentUnit) {
      const words = targetMatch[1].split(/[,，\s]+/).filter(w => w.length > 1 && /[a-zA-Z]/.test(w))
      currentUnit.words = words
    }
    if (!currentUnit || currentUnit.words.length > 0) continue
    const wordList = line.match(/^([a-zA-Z][a-zA-Z,\s'-]{20,})$/)
    if (wordList) {
      const words = wordList[1].split(/[,，\s]+/).filter(w => w.length > 1 && /[a-zA-Z]/.test(w))
      if (words.length >= 8) currentUnit.words = words
    }
  }
  if (currentUnit) units.push(currentUnit)
  return units
}

// Build unit view from TOC structure
export function buildUnitView(structure, found, notFound) {
  const norm = w => w.toLowerCase().replace(/[^a-z0-9]/g, '')
  const foundMap = {}
  found.forEach(f => { foundMap[norm(f.en)] = f })
  const notFoundSet = new Set(notFound.map(w => norm(w)))
  const usedFound = new Set(), usedNotFound = new Set()
  const unitView = []
  structure.forEach(unit => {
    const uf = [], unf = []
    unit.words.forEach(raw => {
      const n = norm(raw)
      if (foundMap[n] && !usedFound.has(n)) { uf.push(foundMap[n]); usedFound.add(n); return }
      if (notFoundSet.has(n) && !usedNotFound.has(n)) { unf.push(raw); usedNotFound.add(n); return }
      let best = null, bestDist = 99, bestKey = null
      for (const [fn, fe] of Object.entries(foundMap)) {
        if (usedFound.has(fn)) continue
        const d = levenshtein(n, fn)
        if (d <= 1 && d < bestDist) { best = fe; bestDist = d; bestKey = fn }
      }
      if (best) { uf.push(best); usedFound.add(bestKey); return }
      if (notFoundSet.has(n)) { /* skip */ } else { unf.push(raw); usedNotFound.add(n) }
    })
    if (uf.length || unf.length) unitView.push({ ...unit, found: uf, notFound: unf })
  })
  // Unassigned
  const uaFound = [], uaNotFound = []
  found.forEach(f => { if (!usedFound.has(norm(f.en))) uaFound.push(f) })
  notFound.forEach(w => { if (!usedNotFound.has(norm(w))) uaNotFound.push(w) })
  return { unitView, unassignedFound: uaFound, unassignedNotFound: uaNotFound }
}
