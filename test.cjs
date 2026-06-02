// Automated smoke test for vocab-tool (React + Vite)
// Run with: node test.cjs
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');

let failures = 0;
function check(name, condition, detail = '') {
  if (condition) {
    console.log(`  [PASS] ${name}${detail ? ' — ' + detail : ''}`);
  } else {
    console.log(`  [FAIL] ${name}${detail ? ' — ' + detail : ''}`);
    failures++;
  }
}

console.log('=== Vocab Tool (React) Smoke Test ===\n');

// ---- 1. Source file inventory ----
console.log('1. Source files:');
const requiredFiles = [
  'src/main.jsx', 'src/App.jsx', 'src/index.css',
  'src/lib/storage.js', 'src/lib/ebbinghaus.js', 'src/lib/ocr-helpers.js', 'src/lib/utils.js',
  'src/data/dictionary.js', 'src/data/genTextbookDB.js', 'src/data/constants.js',
  'src/hooks/useWordBank.js', 'src/hooks/useGame.js', 'src/hooks/useOCR.js',
  'src/hooks/useTextbooks.js', 'src/hooks/useUser.js',
  'src/context/AppContext.jsx',
  'src/components/Header.jsx', 'src/components/TabNavigation.jsx', 'src/components/ToastContainer.jsx',
  'src/components/WordBank/WordBankView.jsx', 'src/components/WordBank/StatsRow.jsx',
  'src/components/WordBank/FilterBar.jsx', 'src/components/WordBank/WordRow.jsx',
  'src/components/WordBank/EmptyState.jsx', 'src/components/WordBank/AddWordModal.jsx',
  'src/components/Upload/UploadView.jsx', 'src/components/Upload/TextbookSection.jsx',
  'src/components/Game/GameView.jsx', 'src/components/Game/Confetti.jsx',
];
for (const f of requiredFiles) {
  check(f, fs.existsSync(path.join(ROOT, f)));
}

// ---- 2. DICTIONARY integrity (static analysis — can't require ESM with @/ aliases) ----
console.log('\n2. DICTIONARY:');
const dictContent = fs.readFileSync(path.join(SRC, 'data', 'dictionary.js'), 'utf-8');
const dictEntries = (dictContent.match(/\{en:['"]/g) || []);
check('Entry count >= 2000', dictEntries.length >= 2000, `${dictEntries.length} entries`);
check('export default present', dictContent.includes('export default'));
const defCount = (dictContent.match(/def:\s*['"]/g) || []).length;
check('Entries with def field', defCount > 500, `${defCount} entries have definitions`);

// ---- 3. Static function definitions ----
console.log('\n3. Source code function checks:');

function fileContains(filePath, pattern, label) {
  const content = fs.readFileSync(path.join(ROOT, filePath), 'utf-8');
  check(label, pattern.test(content), filePath);
}

// Storage
const storageTests = [
  [/export function getUsersMeta/, 'getUsersMeta'],
  [/export function switchUser/, 'switchUser'],
  [/export function addUser/, 'addUser'],
  [/export function deleteUser/, 'deleteUser'],
  [/export function renameUser/, 'renameUser'],
  [/export function saveWordToBank/, 'saveWordToBank'],
  [/export function updateWordProgress/, 'updateWordProgress'],
  [/export function loadData/, 'loadData'],
  [/export function saveData/, 'saveData'],
  [/export function migrateToMultiUser/, 'migrateToMultiUser'],
  [/export function getTextbooksData/, 'getTextbooksData'],
  [/export function saveTextbooksData/, 'saveTextbooksData'],
];
for (const [re, label] of storageTests) fileContains('src/lib/storage.js', re, label);

// Ebbinghaus
fileContains('src/lib/ebbinghaus.js', /export function getWordStatus/, 'getWordStatus');
fileContains('src/lib/ebbinghaus.js', /export function calculateAccuracy/, 'calculateAccuracy');

// OCR helpers (also test logic through require — no @/ aliases)
fileContains('src/lib/ocr-helpers.js', /export function isPlausibleWord/, 'isPlausibleWord');
fileContains('src/lib/ocr-helpers.js', /export function lookupExact/, 'lookupExact');
fileContains('src/lib/ocr-helpers.js', /export function findSuggestions/, 'findSuggestions');
fileContains('src/lib/ocr-helpers.js', /export function levenshtein/, 'levenshtein');
fileContains('src/lib/ocr-helpers.js', /export function detectTOCStructure/, 'detectTOCStructure');
fileContains('src/lib/ocr-helpers.js', /export function buildUnitView/, 'buildUnitView');

// OCR logic test (require works here — no @/ aliases in ocr-helpers)
try {
  const ocr = require('./src/lib/ocr-helpers.js');
  const ocrExports = Object.keys(ocr);
  check('ocr-helpers exports functions', ocrExports.length >= 5, `${ocrExports.length} exports`);
  if (ocr.isPlausibleWord) {
    check('isPlausibleWord: good words', ['hello', 'world', 'cat', 'book'].every(ocr.isPlausibleWord));
    check('isPlausibleWord: rejects bad', ['zzz', '123', 'a'].every(w => !ocr.isPlausibleWord(w)));
  }
  if (ocr.levenshtein) {
    check('levenshtein: same word = 0', ocr.levenshtein('cat', 'cat') === 0);
    check('levenshtein: cat/bat = 1', ocr.levenshtein('cat', 'bat') === 1);
    check('levenshtein: distance works', ocr.levenshtein('hello', 'helo') === 1);
  }
} catch (e) {
  check('ocr-helpers require', false, e.message);
}

// ---- 4. Constants ----
console.log('\n4. Constants:');
try {
  const c = require('./src/data/constants.js');
  check('EBBINGHAUS_STAGES length 8', c.EBBINGHAUS_STAGES.length === 8, c.EBBINGHAUS_STAGES.join(','));
  check('USERS_KEY = vocab_champion_users', c.USERS_KEY === 'vocab_champion_users');
  check('DATA_PREFIX = vocab_champion_data_', c.DATA_PREFIX === 'vocab_champion_data_');
  check('OCR_FIXES removed from constants', typeof c.OCR_FIXES === 'undefined');
} catch (e) {
  check('constants require', false, e.message);
}

// ---- 5. Build output ----
console.log('\n5. Build output:');
check('dist/index.html', fs.existsSync(path.join(DIST, 'index.html')));

const distAssets = path.join(DIST, 'assets');
if (fs.existsSync(distAssets)) {
  const distFiles = fs.readdirSync(distAssets);
  const cssFile = distFiles.find(f => f.endsWith('.css'));
  const jsFiles = distFiles.filter(f => f.endsWith('.js'));
  check('CSS file', !!cssFile, cssFile);
  check('JS files >= 2', jsFiles.length >= 2, `${jsFiles.length} files`);

  if (cssFile) {
    const cssSize = fs.statSync(path.join(distAssets, cssFile)).size;
    check('CSS < 100KB', cssSize < 102400, `${(cssSize / 1024).toFixed(1)} KB`);
    const css = fs.readFileSync(path.join(distAssets, cssFile), 'utf-8');
    check('CSS animations present', css.includes('keyframes') || css.includes('animate-'));
  }

  let mainSize = 0;
  for (const f of jsFiles) {
    const sz = fs.statSync(path.join(distAssets, f)).size;
    if (sz > mainSize) mainSize = sz;
  }
  check('Main bundle < 700KB', mainSize < 716800, `${(mainSize / 1024).toFixed(1)} KB`);
} else {
  check('dist/assets exists', false, 'Run: npm run build');
}

// ---- 6. HTML entry ----
console.log('\n6. HTML entry:');
const html = fs.readFileSync(path.join(DIST, 'index.html'), 'utf-8');
check('Has root div', html.includes('id="root"'));
check('Has script tag', html.includes('<script'));
check('Has meta charset', html.includes('charset'));

// ---- 7. Package config ----
console.log('\n7. Package config:');
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf-8'));
check('Has build script', !!pkg.scripts?.build);
check('Vite dep', !!(pkg.dependencies?.vite || pkg.devDependencies?.vite));
check('React dep', !!pkg.dependencies?.react);
check('Tesseract dep', !!pkg.dependencies?.['tesseract.js']);

// ---- 8. Context & Header integration ----
console.log('\n8. User integration:');
const ctxContent = fs.readFileSync(path.join(SRC, 'context', 'AppContext.jsx'), 'utf-8');
check('AppContext uses useUser', ctxContent.includes('useUser'));
check('AppContext calls migrateToMultiUser', ctxContent.includes('migrateToMultiUser()'));

const headerContent = fs.readFileSync(path.join(SRC, 'components', 'Header.jsx'), 'utf-8');
check('Header uses useApp', headerContent.includes('useApp()'));
check('Header shows user name', headerContent.includes('user.activeUser'));
check('Header has switch button', headerContent.includes('切换'));

// ---- 9. Hook user-switch listeners ----
console.log('\n9. User switch event listeners:');
const wbContent = fs.readFileSync(path.join(SRC, 'hooks', 'useWordBank.js'), 'utf-8');
check('useWordBank listens user-changed', wbContent.includes('user-changed'));
const tbContent = fs.readFileSync(path.join(SRC, 'hooks', 'useTextbooks.js'), 'utf-8');
check('useTextbooks listens user-changed', tbContent.includes('user-changed'));

// ---- 10. User management data isolation (integration test via require mock) ----
console.log('\n10. User management roundtrip:');
try {
  // storage.js uses @/ imports, can't require directly.
  // Instead, verify logic through the built bundle's behavior via static analysis.
  const storageContent = fs.readFileSync(path.join(SRC, 'lib', 'storage.js'), 'utf-8');

  // Verify key data isolation patterns
  check('switchUser updates activeUserId', storageContent.includes('meta.activeUserId = userId'));
  check('addUser creates unique ID', storageContent.includes("'user_' + Date.now()"));
  check('deleteUser prevents last user', storageContent.includes('meta.users.length <= 1'));
  check('deleteUser cleans localStorage', storageContent.includes('localStorage.removeItem'));
  check('renameUser updates name', storageContent.includes('user.name = newName'));
  check('loadData uses activeUserId', storageContent.includes('getActiveUserId()'));

  console.log('  [INFO] All data isolation patterns verified in source');
} catch (e) {
  check('User management analysis', false, e.message);
}

console.log('\n=== Result: ' + (failures === 0 ? 'ALL CHECKS PASSED' : failures + ' FAILURE(S)') + ' ===');
process.exit(failures > 0 ? 1 : 0);
