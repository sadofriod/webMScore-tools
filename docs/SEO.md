# SEO / GEO record — webmscore.ashesborn.cloud

Append a dated section per pass. Do not re-research what is written here.

## 2026-11-24 — demand pass, conversion unblock, 7 pages

### Why
GA4 property 482448072 showed 105 sessions / 90 days, 18 in the last 28 (previous 28: 25), 0 in the last 7,
and zero key events. Monthly sessions fell 156 (May) → 11 (Nov, 24 days). Bing organic supplied 45 of the
105 sessions (43%). No conversion was ever measured because none was instrumented.

### Measured demand (Google Ads worldwide, 2026-11-24, DataForSEO; KD = Labs US)
| phrase | /mo | KD | page-one shape |
|---|---|---|---|
| midi to mp3 | 12,100 | 8 | forum thread #1, app stores, how-tos — no web tool |
| midi converter | 6,600 | 4 | apps + how-tos |
| midi to wav | 5,400 | 0 | zip tools, new domains |
| midi to sheet music | 2,900 | 0 | Ask Ubuntu, Quora, Reddit — no web tool |
| musescore to pdf | 720 | 13 | Reddit, MuseScore docs, Facebook |
| mscz to pdf | 590 | 7 | file-extension.info autogen, Reddit, signNow |
| mscz to mp3 | 170 | 0 | weak |
| musicxml to midi | 390 | 0 | Melobytes, GitHub repos, Reddit |

Cluster the tool can deliver: ~36,800/mo. Out of reach (OMR / transcription): pdf to midi 4,400,
sheet music to midi 2,400, audio to sheet music 2,400, mp3 to sheet music 1,900 — do not build pages for these.
Every SERP above carries an AI Overview first, so each page opens with a self-contained answer paragraph.

### Keyword → page map (live)
| page | title | primary phrase |
|---|---|---|
| `/` | MIDI Converter — MIDI to MP3, WAV, PDF in browser | midi converter |
| `/midi-to-mp3/` | MIDI to MP3 Converter — free, in your browser | midi to mp3 |
| `/midi-to-wav/` | MIDI to WAV Converter — free, no upload | midi to wav |
| `/midi-to-sheet-music/` | MIDI to Sheet Music — MIDI to notation, free | midi to sheet music |
| `/mscz-to-pdf/` | MSCZ to PDF — MuseScore file to PDF, no upload | mscz to pdf / musescore to pdf |
| `/mscz-to-mp3/` | MSCZ to MP3 — render a MuseScore score to audio | mscz to mp3 |
| `/musicxml-to-midi/` | MusicXML to MIDI — convert notation to a .mid file | musicxml to midi |

### What was broken (root cause, not a guess)
`webmscore` runs its core in a worker that needs `SharedArrayBuffer`, which a page only gets when it is
cross-origin isolated. Production sent neither `Cross-Origin-Opener-Policy` nor
`Cross-Origin-Embedder-Policy`, so `WebMscore.load()` never settled — the UI sat on
"Creating score from file..." forever. Measured: live site 60 s, no result, no console error.
Second defect: the page called `load('mscz', data)` for every upload, so MusicXML/MIDI input failed with
`WebMscore Err[2009] File "" is corrupted` (and the accepted-format list advertised 22 extensions, 9 of
which the engine cannot read).

### Changed
- `dist/_headers`: `cross-origin-opener-policy: same-origin`, `cross-origin-embedder-policy: require-corp`.
  Verified safe: jsdelivr, googletagmanager and the GA collect beacon all answer with
  `cross-origin-resource-policy: cross-origin` / CORS, so `require-corp` blocks none of them.
- `dist/webMSocre_V3.js`: format dispatch by extension (`mscz mscx mxl musicxml xml mid midi kar gtp gp3 gp4
  gp5 gpx gp ptb`), 45 s load / 120 s audio timeouts with a visible error, soundfont fetch checks `res.ok`,
  and `convert_start` / `convert_success` / `convert_error` events.
- Pinned `webmscore@1.2.1` from the CDN.
- Three new pages, four retitled, one H1 each, 2 JSON-LD blocks each with `FAQPage` mirroring the visible
  `<h3>`s verbatim, `max-snippet:-1` + `max-image-preview:large`, gtag on every page, `cta_click` events.
- `llms.txt` (new), `robots.txt` names 12 crawler groups incl. ChatGPT-User / Claude-SearchBot /
  Applebot-Extended / CCBot / meta-externalagent, `sitemap.xml` 7 URLs.

### Verified (measured, not inferred)
- Local, `dist/` behind COOP+COEP: mscz→PDF 368 ms, MIDI→PDF 337 ms, MusicXML→PDF 358 ms, MIDI→MP3 7.6 s
  (14.5 MB soundfont), unsupported extension rejected with a message, `convert_start`+`convert_success` in
  dataLayer.
- Production after deploy (Chromium): `crossOriginIsolated=true`, mscz→PDF 4.5 s cold, download enabled,
  both events fired. All 7 pages + `llms.txt` + `sitemap.xml` + `robots.txt` + IndexNow key return 200.
- IndexNow submitted for all 7 URLs (HTTP 200).

### Still missing
1. GA4: mark `convert_success` as a key event, and build a funnel `page_view → convert_start →
   convert_success` (admin UI, no API key here).
2. `.md` twins per page + `llms-full.txt`, served `text/markdown` with `x-robots-tag: noindex`
   (GEO checklist item 7).
3. Authority: zero referring domains. This, not on-page work, is the ranking ceiling. Next actions: a real
   body link from a forum answer (r/Musescore, MuseScore forum "how do I convert MIDI to MP3"), AlternativeTo
   listing, and one blog post on blog.ashesborn.cloud linking each tool page.
4. Decision gate 2026-12-24: `convert_success` ≥ 30 and Bing clicks ≥ 60/month → invest in more format
   pages and link work; otherwise freeze.
