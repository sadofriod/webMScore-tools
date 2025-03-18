// Define the translations for each language
const translations = {
  'en': {
    pageTitle: 'WebMScore Music Converter',
    uploadTitle: 'Upload Music File',
    uploadInstructions: 'Select a music file to convert (MusicXML, MSCZ, MSCX, etc.)',
    dragDropText: 'Drag and drop your music file here',
    browseFiles: 'Browse Files',
    convertTitle: 'Convert To',
    formatMscz: 'MuseScore Format (MSCZ)',
    formatMusicxml: 'MusicXML',
    formatPdf: 'PDF',
    formatMidi: 'MIDI',
    formatMp3: 'MP3',
    formatWav: 'WAV',
    formatFlac: 'FLAC',
    formatOgg: 'OGG',
    formatPng: 'PNG',
    convertBtn: 'Convert',
    downloadBtn: 'Download Converted File',
    previewTitle: 'Preview',
    tagline: 'Free online tool to convert between music score formats'
  },
  'es': {
    pageTitle: 'Convertidor de Música WebMScore',
    uploadTitle: 'Subir Archivo de Música',
    uploadInstructions: 'Seleccione un archivo de música para convertir (MusicXML, MSCZ, MSCX, etc.)',
    dragDropText: 'Arrastre y suelte su archivo de música aquí',
    browseFiles: 'Explorar Archivos',
    convertTitle: 'Convertir A',
    formatMscz: 'Formato MuseScore (MSCZ)',
    formatMusicxml: 'MusicXML',
    formatPdf: 'PDF',
    formatMidi: 'MIDI',
    formatMp3: 'MP3',
    formatWav: 'WAV',
    formatFlac: 'FLAC',
    formatOgg: 'OGG',
    formatPng: 'PNG',
    convertBtn: 'Convertir',
    downloadBtn: 'Descargar Archivo Convertido',
    previewTitle: 'Vista Previa',
    tagline: 'Herramienta gratuita en línea para convertir entre formatos de partituras musicales'
  },
  'fr': {
    pageTitle: 'Convertisseur de Musique WebMScore',
    uploadTitle: 'Télécharger un Fichier de Musique',
    uploadInstructions: 'Sélectionnez un fichier de musique à convertir (MusicXML, MSCZ, MSCX, etc.)',
    dragDropText: 'Glissez et déposez votre fichier de musique ici',
    browseFiles: 'Parcourir les Fichiers',
    convertTitle: 'Convertir En',
    formatMscz: 'Format MuseScore (MSCZ)',
    formatMusicxml: 'MusicXML',
    formatPdf: 'PDF',
    formatMidi: 'MIDI',
    formatMp3: 'MP3',
    formatWav: 'WAV',
    formatFlac: 'FLAC',
    formatOgg: 'OGG',
    formatPng: 'PNG',
    convertBtn: 'Convertir',
    downloadBtn: 'Télécharger le Fichier Converti',
    previewTitle: 'Aperçu',
    tagline: 'Outil en ligne gratuit pour convertir entre les formats de partitions musicales'
  },
  'ja': {
    pageTitle: 'WebMScore 音楽コンバーター',
    uploadTitle: '音楽ファイルをアップロード',
    uploadInstructions: '変換する音楽ファイルを選択してください (MusicXML, MSCZ, MSCX, など)',
    dragDropText: '音楽ファイルをここにドラッグ＆ドロップ',
    browseFiles: 'ファイルを参照',
    convertTitle: '変換先',
    formatMscz: 'MuseScoreフォーマット (MSCZ)',
    formatMusicxml: 'MusicXML',
    formatPdf: 'PDF',
    formatMidi: 'MIDI',
    formatMp3: 'MP3',
    formatWav: 'WAV',
    formatFlac: 'FLAC',
    formatOgg: 'OGG',
    formatPng: 'PNG',
    convertBtn: '変換',
    downloadBtn: '変換したファイルをダウンロード',
    previewTitle: 'プレビュー',
    tagline: '楽譜フォーマット間の無料オンライン変換ツール'
  },
  'zh': {
    pageTitle: 'WebMScore 音乐转换工具',
    uploadTitle: '上传音乐文件',
    uploadInstructions: '选择要转换的音乐文件 (MusicXML, MSCZ, MSCX, 等)',
    dragDropText: '将音乐文件拖放到此处',
    browseFiles: '浏览文件',
    convertTitle: '转换为',
    formatMscz: 'MuseScore 格式 (MSCZ)',
    formatMusicxml: 'MusicXML',
    formatPdf: 'PDF',
    formatMidi: 'MIDI',
    formatMp3: 'MP3',
    formatWav: 'WAV',
    formatFlac: 'FLAC',
    formatOgg: 'OGG',
    formatPng: 'PNG',
    convertBtn: '转换',
    downloadBtn: '下载转换后的文件',
    previewTitle: '预览',
    tagline: '免费在线工具，用于转换不同的音乐乐谱格式'
  },
  'zh-tw': {
    pageTitle: 'WebMScore 音樂轉換工具',
    uploadTitle: '上傳音樂檔案',
    uploadInstructions: '選擇要轉換的音樂檔案 (MusicXML, MSCZ, MSCX, 等)',
    dragDropText: '將音樂檔案拖放到此處',
    browseFiles: '瀏覽檔案',
    convertTitle: '轉換為',
    formatMscz: 'MuseScore 格式 (MSCZ)',
    formatMusicxml: 'MusicXML',
    formatPdf: 'PDF',
    formatMidi: 'MIDI',
    formatMp3: 'MP3',
    formatWav: 'WAV',
    formatFlac: 'FLAC',
    formatOgg: 'OGG',
    formatPng: 'PNG',
    convertBtn: '轉換',
    downloadBtn: '下載轉換後的檔案',
    previewTitle: '預覽',
    tagline: '免費線上工具，用於轉換不同的音樂樂譜格式'
  }
};

// Get the user's preferred language from the selector
function getCurrentLanguage() {
  const languageSelector = document.getElementById('languageSelector');
  return languageSelector.value || 'en'; // Default to English
}

// Update page text based on selected language
function updateLanguage() {
  const currentLang = getCurrentLanguage();
  const langData = translations[currentLang] || translations['en']; // Fallback to English
  
  // Update elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (langData[key]) {
      element.textContent = langData[key];
    }
  });
  
  // Update option elements with data-i18n-option attribute
  document.querySelectorAll('[data-i18n-option]').forEach(element => {
    const key = element.getAttribute('data-i18n-option');
    if (langData[key]) {
      element.textContent = langData[key];
    }
  });
}

// Function to set language explicitly
function setLanguage(lang) {
  if (translations[lang]) {
    const languageSelector = document.getElementById('languageSelector');
    languageSelector.value = lang;
    updateLanguage();
  }
}

// Initialize language handling
document.addEventListener('DOMContentLoaded', () => {
  const languageSelector = document.getElementById('languageSelector');
  
  // Set initial language (could be from browser preference or saved setting)
  updateLanguage();
  
  // Update language when selector changes
  languageSelector.addEventListener('change', updateLanguage);
});
