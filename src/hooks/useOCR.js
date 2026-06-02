import { useState, useCallback, useRef } from 'react'
import DICTIONARY from '@/data/dictionary'
import { buildDictIndex, isPlausibleWord, lookupExact, findSuggestions, detectMultiWordTerms, detectTOCStructure, buildUnitView } from '@/lib/ocr-helpers'

let _dictCache = null
function getDictCache() {
  if (!_dictCache) _dictCache = buildDictIndex(DICTIONARY)
  return _dictCache
}

function preprocessImage(imgEl) {
  const c = document.createElement('canvas')
  c.width = imgEl.naturalWidth
  c.height = imgEl.naturalHeight
  const ctx = c.getContext('2d')
  ctx.drawImage(imgEl, 0, 0)
  const imageData = ctx.getImageData(0, 0, c.width, c.height)
  const d = imageData.data
  for (let i = 0; i < d.length; i += 4) {
    const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]
    const contrast = Math.max(0, Math.min(255, (gray - 40) * (255 / (220 - 40))))
    d[i] = d[i + 1] = d[i + 2] = contrast
  }
  ctx.putImageData(imageData, 0, 0)
  return c
}

function preprocessTOCImage(imgEl) {
  const c = document.createElement('canvas')
  const maxDim = 1200
  let w = imgEl.naturalWidth, h = imgEl.naturalHeight
  const scale = Math.min(1, maxDim / Math.max(w, h))
  w = Math.round(w * scale); h = Math.round(h * scale)
  c.width = w; c.height = h
  const ctx = c.getContext('2d')
  ctx.drawImage(imgEl, 0, 0, w, h)
  const imageData = ctx.getImageData(0, 0, w, h)
  const d = imageData.data
  // Grayscale pass
  const gray = new Uint8Array(w * h)
  for (let i = 0; i < d.length; i += 4) gray[i >> 2] = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]
  // Adaptive threshold: 5x5 local window
  const k = 2
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sum = 0, ct = 0
      const y0 = Math.max(0, y - k), y1 = Math.min(h - 1, y + k)
      const x0 = Math.max(0, x - k), x1 = Math.min(w - 1, x + k)
      for (let ny = y0; ny <= y1; ny++) for (let nx = x0; nx <= x1; nx++) { sum += gray[ny * w + nx]; ct++ }
      const mean = sum / ct
      const pix = gray[y * w + x]
      const bw = pix > mean - 8 ? 255 : 0
      const idx = (y * w + x) << 2
      d[idx] = d[idx + 1] = d[idx + 2] = bw
    }
  }
  ctx.putImageData(imageData, 0, 0)
  return c
}

export default function useOCR() {
  const [tocMode, setTocMode] = useState(false)
  const [autoCorrect, setAutoCorrect] = useState(false)
  const [status, setStatus] = useState('idle') // idle | preprocessing | recognizing | done | error
  const [progress, setProgress] = useState(0)
  const [statusMsg, setStatusMsg] = useState('')
  const [found, setFound] = useState([])
  const [notFound, setNotFound] = useState([])
  const [rawText, setRawText] = useState('')
  const [unitView, setUnitView] = useState(null)
  const [fuzzyFixed, setFuzzyFixed] = useState([])
  const [suggestions, setSuggestions] = useState({})
  const imgUrlRef = useRef(null)

  const processFile = useCallback(async (file) => {
    setStatus('preprocessing')
    setStatusMsg('正在预处理图片' + (tocMode ? ' (TOC模式)' : '') + '...')
    setProgress(0)
    setFound([])
    setNotFound([])
    setRawText('')
    setUnitView(null)
    setFuzzyFixed([])

    try {
      // Load image
      const imgBlobUrl = URL.createObjectURL(file)
      imgUrlRef.current = imgBlobUrl
      const imgEl = await new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = imgBlobUrl
      })

      // Preprocess
      const processedCanvas = tocMode ? preprocessTOCImage(imgEl) : preprocessImage(imgEl)
      URL.revokeObjectURL(imgBlobUrl)
      imgUrlRef.current = null

      setStatus('recognizing')
      setStatusMsg('正在初始化OCR引擎...')

      // Dynamic import Tesseract
      const Tesseract = await import('tesseract.js')

      setStatusMsg('正在识别文字' + (tocMode ? ' (仅英文TOC模式)' : '(中英双语)') + '...')
      const ocrLang = tocMode ? 'eng' : 'eng+chi_sim'

      const worker = await Tesseract.recognize(processedCanvas, ocrLang, {
        logger: m => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100))
            setStatusMsg(`识别中... ${Math.round(m.progress * 100)}%`)
          }
        },
      })

      const text = worker.data.text
      setRawText(text)

      // Extract English words
      const { map: dictMap, entries: dictEntries } = getDictCache()
      const rawWords = text.match(/[a-zA-Z]{2,}(?:[-'][a-zA-Z]{2,})*(?: [a-zA-Z]{2,}(?:[-'][a-zA-Z]{2,})*)?/g) || []
      const plausibleWords = rawWords.filter(w => isPlausibleWord(w))
      const uniqueWords = [...new Set(plausibleWords.map(w => w.toLowerCase()))]

      // Detect multi-word terms
      const multiWords = detectMultiWordTerms(text, dictEntries)
      multiWords.forEach(w => uniqueWords.push(w))

      if (uniqueWords.length === 0) {
        setStatus('error')
        setStatusMsg('未识别到英文单词，请确认图片清晰包含英文文本')
        return
      }

      // Match against dictionary — EXACT MATCH ONLY (never replace original word)
      const foundList = [], notFoundList = [], suggestionMap = {}
      uniqueWords.forEach(w => {
        const exact = lookupExact(w, dictMap)
        if (exact) {
          // Exact match: word IS in dictionary, safe to use dictionary metadata
          foundList.push({
            en: exact.en, zh: exact.zh || '',
            def: exact.def || '', phonetic: exact.phonetic || '',
            pos: exact.pos || '',
          })
        } else {
          // Not in dictionary: preserve original OCR word, optionally suggest alternatives
          notFoundList.push(w)
          if (autoCorrect) {
            const sugs = findSuggestions(w, dictEntries, 2)
            if (sugs.length > 0) suggestionMap[w.toLowerCase()] = sugs
          }
        }
      })

      setFound(foundList)
      setNotFound(notFoundList)
      setSuggestions(suggestionMap)
      setFuzzyFixed([])

      // TOC structure detection
      if (tocMode) {
        const structure = detectTOCStructure(text)
        if (structure && structure.length >= 2) {
          setUnitView(buildUnitView(structure, foundList, notFoundList))
        }
      }

      const matchedWithDef = foundList.filter(w => w.def).length
      setStatus('done')
      setStatusMsg(`识别到 ${uniqueWords.length} 个单词，${foundList.length} 个已匹配词典 (${matchedWithDef}个含英文释义)`)
    } catch (e) {
      setStatus('error')
      setStatusMsg('识别失败: ' + (e.message || '未知错误'))
      if (imgUrlRef.current) { URL.revokeObjectURL(imgUrlRef.current); imgUrlRef.current = null }
    }
  }, [tocMode, autoCorrect])

  const reset = useCallback(() => {
    setStatus('idle')
    setProgress(0)
    setStatusMsg('')
    setFound([])
    setNotFound([])
    setRawText('')
    setUnitView(null)
    setFuzzyFixed([])
    setSuggestions({})
  }, [])

  return {
    tocMode, setTocMode,
    autoCorrect, setAutoCorrect,
    status, progress, statusMsg,
    found, setFound,
    notFound, setNotFound,
    suggestions,
    rawText, unitView, fuzzyFixed,
    processFile, reset,
  }
}
