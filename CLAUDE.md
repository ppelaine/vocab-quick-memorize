# CLAUDE.md — 单词快快记 Vocab Flash

单文件 PWA 应用，~490KB，所有 HTML/CSS/JS 内联于 `index.html`。

## 部署

- **URL:** https://ppelaine.github.io/vocab-quick-memorize/
- **方式:** GitHub Pages，master 分支根目录
- **推送:** `git push origin master`（443 端口间歇被墙，多试几次）

## 架构

```
vocab-tool/
├── index.html      # 部署文件 — 单文件，CSS + JS 全部内联 (~490KB)
├── app.js          # 源码文件 — 编辑用，修改后需重新内联到 index.html
├── sw.js           # Service Worker — PWA 离线缓存
├── manifest.json   # PWA 配置
├── icon-192.svg    # PWA 图标
├── icon-512.svg    # PWA 图标
├── CLAUDE.md       # 本文件
├── PRD.md          # 产品需求文档
├── package.json    # (历史遗留 — React/Vite 构建，当前不用)
├── src/            # (历史遗留 — React 组件，当前不用)
└── dist/           # (历史遗留 — Vite 构建产物，当前不用)
```

**核心原则：`app.js` 是编辑文件，`index.html` 是部署文件。** 改了 `app.js` 就必须重新内联。

## 修改流程

1. 编辑 `app.js`
2. 内联到 `index.html`：
```bash
cd vocab-tool && node -e "
var fs=require('fs');
var html=fs.readFileSync('index.html','utf8');
var js=fs.readFileSync('app.js','utf8');
var s=html.indexOf('<script>');
var e=html.indexOf('</script></body>');
html=html.substring(0,s+8)+'\r\n'+js+'\r\n'+html.substring(e);
fs.writeFileSync('index.html',html,'utf8');
"
```
3. 桌面 Chrome 打开 `index.html` 验证
4. `git commit -a && git push`

## 功能

| Tab | 功能 |
|-----|------|
| 复习 | 艾宾浩斯遗忘曲线管理，按阶段筛选（新词/学习中/待复习/已掌握/错词） |
| 词库 | OCR 拍照上传，教材搜索，手动添加，词典辅助匹配 |
| 游戏 | 看英选中 / 看释义选词 / 补全元音字母，计时计分 |
| 我的 | 打卡日历，头像，多用户切换 |

## 核心数据

- **DICTIONARY** — ~2200 词条 `{en, zh, def, phonetic, pos}`
- **Word Bank** — 用户词汇 + 艾宾浩斯复习阶段 (8 stages: 5min → 15天)
- **Textbooks** — Cambridge Think 2 Unit 1/2 等教材词汇
- **Users** — 多用户支持，localStorage 按 user ID 隔离

## ⚠️ 重要教训

**Android Chrome 外部 JS 加载 BUG：** 以下方式在 Android Chrome 上全部失败：
- `<script src="app.js">` — 标签在 DOM 中但代码不执行
- `eval()` — 报 "Unexpected token '.'"（可能是 optional chaining 或大文件限制）
- 动态 `createElement('script')` + `src` — onload 触发但代码不执行
- 动态 `createElement('script')` + `textContent` — 代码不执行
- Blob URL — 代码不执行
- 同步 XHR + textContent — 代码不执行

**唯一可行方案：将 JS 直接内联到 HTML 的 `<script>` 标签中。不要拆分外部 JS 文件。**

桌面 Chrome 完全没有这些问题，怀疑是 Android Chrome V8 引擎的解析限制。`app.js` 中有 43 处 optional chaining (`?.`)，如果移动端 Chrome 版本较老可能不兼容。但没有进一步定位——内联方案已解决。

## 不应做的事

- ❌ 不要把 JS 拆成外部文件
- ❌ 不要用 `eval()` 或动态加载大段 JS
- ❌ 不要删除 `app.js`（编辑源文件，修改后内联到 index.html）
- ❌ 不要依赖 `src/` 里的 React 代码（已过时，功能不全）
