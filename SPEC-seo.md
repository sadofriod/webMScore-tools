# SPEC — webmscore.ashesborn.cloud：SEO 基础设施 + 3 个格式落地页

**只在 `dist/` 下动手**（`wrangler.jsonc` 的 `assets.directory` 是 `./dist`，只有它会被部署）。
根目录的同名文件是上游副本，**不要改**，避免两份漂移。

**硬性禁止**：不要 `npm install`、不要 `wrangler`、不要 `git commit/push`、不要联网抓页面。
仓库里没有 `package.json`，也没有构建步骤——`dist/` 就是产物。

---

## 1. `dist/robots.txt`（新建）

```
# webmscore.ashesborn.cloud
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /

Sitemap: https://webmscore.ashesborn.cloud/sitemap.xml
```

## 2. `dist/sitemap.xml`（新建）

4 个 URL，`lastmod` 全部 `2026-11-18`，无 hreflang（站内是 JS 切换语言，没有独立 URL）：

- `https://webmscore.ashesborn.cloud/`（priority 1.0）
- `https://webmscore.ashesborn.cloud/mscz-to-mp3/`（0.8）
- `https://webmscore.ashesborn.cloud/musicxml-to-midi/`（0.8）
- `https://webmscore.ashesborn.cloud/midi-to-mp3/`（0.8）

标准 sitemaps.org 0.9 schema，XML 头 `<?xml version="1.0" encoding="UTF-8"?>`。

## 3. `dist/10ed2471dc05d90b9c7b554bc9ea8198.txt`（新建，文件名就是 key 本身）

文件名：`10ed2471dc05d90b9c7b554bc9ea8198.txt`
内容（单行，不带换行以外的任何东西）：`10ed2471dc05d90b9c7b554bc9ea8198`

## 4. `dist/index.html`（改，只加一块内链）

在现有 `<footer class="site-friends">` **之前**插入一块格式导航：

```html
  <nav class="format-nav" aria-label="Convert by format">
    <h2>Convert by format</h2>
    <ul>
      <li><a href="/mscz-to-mp3/">MSCZ to MP3 — render a MuseScore file to audio</a></li>
      <li><a href="/musicxml-to-midi/">MusicXML to MIDI — get an editable performance file</a></li>
      <li><a href="/midi-to-mp3/">MIDI to MP3 — render a .mid file with General MIDI sounds</a></li>
    </ul>
  </nav>
```

同时在 `dist/style.css` 末尾追加最小样式（与现有风格一致，圆角、深色链接、无阴影）：

```css
.format-nav { margin: 2rem auto; max-width: 760px; padding: 0 1rem; }
.format-nav h2 { font-size: 1.05rem; margin: 0 0 .6rem; opacity: .85; }
.format-nav ul { list-style: none; padding: 0; margin: 0; display: grid; gap: .5rem; }
.format-nav a { display: block; padding: .6rem .8rem; border: 1px solid rgba(255,255,255,.18); border-radius: 8px; text-decoration: none; }
.format-nav a:hover { border-color: rgba(255,255,255,.45); }
```

## 5. `dist/webMSocre_V3.js`（改：支持 `?to=` 预选输出格式）

落地页会链接到 `/?to=mp3` 这样的地址。在脚本初始化输出格式选择器的地方（找到 `outputFormat` 
相关的初始化 / `DOMContentLoaded` 逻辑），加上：读取 `new URLSearchParams(location.search).get('to')`，
若该值能在 `#outputFormat` 的 `<option>` 里找到同 `value`，就设置 `select.value = to` 并触发一次 `change`。
找不到就保持默认，不报错、不 console 报错。**不要**改动其它转换逻辑。

## 6. 三个落地页（新建目录，每页一个 `index.html`）

共用要求：
- `<html lang="en">`，`<meta name="viewport">`，`<link rel="stylesheet" href="/style.css">`
- `canonical` 指自己；`<meta name="robots" content="index, follow">`
- 一页一个 `<h1>`；`<h2>` 顺序：What this does / How to convert / What you get / FAQ
- 顶部一个返回链接：`<a href="/">← WebMScore converter</a>`
- 页脚一条：`Powered by <a href="https://github.com/LibreScore/webmscore" rel="noopener">WebMScore</a> (LibreScore)`
- 每页两段 JSON-LD：`WebApplication`（name/url/applicationCategory: MultimediaApplication/offers price 0）+ `FAQPage`（问题与可见 H3 **逐字一致**）
- 正文下面互相内链：链接另外两个格式页（用描述性锚文本，不要 "click here"）
- 所有正文事实必须与本页给出的文案一致，**不要新增宣传性数字**（不说 "fastest"、不说 "millions of users"）

### 5.1 `/mscz-to-mp3/index.html`

- title：`MSCZ to MP3 online — convert a MuseScore file to audio`
- description：`Convert a MuseScore .mscz or .mscx file to MP3 in the browser. The score is rendered with the FluidR3 General MIDI soundfont; the file is not uploaded.`
- h1：`Convert MSCZ to MP3 in the browser`
- What this does（正文首段，答案式，便于被摘要引用）：
  `MSCZ is MuseScore's compressed score format — notation, layout and instrument data, with no audio in it. Converting it to MP3 means rendering the score through a soundfont so you get a playable file. This page opens the converter with MP3 already selected; the rendering happens in your browser and the score is never uploaded.`
- How to convert：三步 `<ol>`：1) Choose your `.mscz` or `.mscx` file；2) Output format is already set to MP3 — press Convert；3) Download the rendered file when the progress bar finishes.
- What you get：MP3 是音频，**没有版面和分页**；音色来自 `FluidR3Mono_GM.sf3`（General MIDI），所以是通用 GM 音色，不是你 DAW 里的采样库；速度、力度、乐器按谱面所写渲染。要版面请导出 PDF。
- FAQ（3 条，H3 逐字）：
  - `Does the MP3 keep the score's layout?` → `No. MP3 is audio only — layout, page breaks and engraving are not part of the file. Export PDF if you need the printed score.`
  - `Can I convert an .mscx file the same way?` → `Yes. .mscx is the uncompressed MuseScore format; drop it in the same box and choose MP3.`
  - `Is my file uploaded to a server?` → `No. The conversion runs in your browser with WebMScore (WebAssembly); only the soundfont and the page assets are downloaded.`
- CTA 按钮：`<a class="cta" href="/?to=mp3">Open the converter with MP3 selected</a>`

### 5.2 `/musicxml-to-midi/index.html`

- title：`MusicXML to MIDI online — editable performance file`
- description：`Convert MusicXML to MIDI in the browser. Notes, tempo and parts become a .mid file you can open in any DAW; layout and lyrics do not carry over.`
- h1：`Convert MusicXML to MIDI`
- What this does：`MusicXML describes notation — notes, parts, articulations, layout. MIDI describes a performance — notes, velocity, tempo, channels. Converting one to the other gives you a file a DAW or sequencer can open and edit; the engraving does not come with it.`
- How to convert：1) Choose a `.musicxml` or `.xml` file；2) Set the output to MIDI（默认可能不是 MIDI，需手动选择）；3) Convert, then Download.
- What you get：每个声部映射到一个 MIDI 通道；谱面写的速度变化保留为 tempo 事件；歌词、排练记号、版面等纯记谱信息不带入；力度按谱面标记近似，不是真实演奏。
- FAQ：
  - `Does the MIDI keep tempo changes?` → `Yes, tempo markings written in the score are exported as tempo events.`
  - `Why are some articulations missing?` → `MIDI has no concept of a staccato dot or a slur; only what the renderer can express as note timing or velocity survives.`
  - `Can I open the result in a DAW?` → `Yes — the file is a standard .mid and opens in Ableton, Logic, Reaper, MuseScore and most notation software.`
- CTA：`<a class="cta" href="/?to=midi">Open the converter with MIDI selected</a>`

### 5.3 `/midi-to-mp3/index.html`

- title：`MIDI to MP3 online — render a .mid file to audio`
- description：`Turn a .mid or .midi file into MP3 in the browser. Rendering uses the General MIDI FluidR3 soundfont, so instruments sound like GM presets, not your own library.`
- h1：`Convert MIDI to MP3`
- What this does：`A MIDI file stores notes and instrument programs — no sound. Making an MP3 means rendering it through a sound bank. This converter renders with the General MIDI FluidR3 soundfont in your browser, which is why a piano track plays as a GM piano rather than your DAW's sampled piano.`
- How to convert：1) Choose `.mid`, `.midi` or `.kar`；2) Set the output to MP3；3) Convert, then Download.
- What you get：所有轨道会被混合成一个立体声 MP3；音色由 General MIDI 程序号决定；如果原文件依赖自定义音源，结果会和你在 DAW 里听到的不同。
- FAQ：
  - `Why does it sound different from my DAW?` → `The render uses the General MIDI FluidR3 soundfont. Any custom instrument in the original arrangement is replaced by the matching GM preset.`
  - `Are all tracks mixed together?` → `Yes — the output is one mixed audio file, not a stem export.`
  - `Does it accept .kar files?` → `Yes, .kar (MIDI karaoke) files are accepted; the lyrics are not rendered into the audio.`
- CTA：`<a class="cta" href="/?to=mp3">Open the converter with MP3 selected</a>`

## 7. `.github/workflows/deploy-cloudflare.yml`（新建）

与其他站点同一套：push 到 `master` 时用 `cloudflare/wrangler-action@v3`，`command: deploy`，
`apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}`，`accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}`。
注意本仓库**没有构建步骤**（assets 目录就是 `./dist`），所以不要加 install/build 步骤。

## 8. 验收（改完自己跑，把原始输出贴回来）

```
python3 -c "import xml.dom.minidom,glob; [xml.dom.minidom.parse(f) for f in ['dist/sitemap.xml']]; print('sitemap ok')"
python3 -c "import json,re,glob
for f in glob.glob('dist/*-to-*/index.html'):
    h=open(f).read()
    for b in re.findall(r'<script type=\"application/ld\\+json\">(.*?)</script>',h,re.S): json.loads(b)
    print(f, 'h1', h.count('<h1'), 'ldjson', len(re.findall(r'application/ld\\+json',h)))
"
grep -c 'format-nav' dist/index.html
ls dist/*.txt
```
