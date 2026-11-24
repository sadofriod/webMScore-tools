document.addEventListener('DOMContentLoaded', async () => {
  // Initialize WebMScore
  await window.WebMscore.ready;
  document.getElementById('progressInfo').textContent = 'WebMScore initialized successfully!';

  let convertedData = null;
  let fileName = '';
  const convertBtn = document.getElementById('convertBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const fileInput = document.getElementById('musicFile');
  const outputFormatSelect = document.getElementById('outputFormat');
  const progressInfo = document.getElementById('progressInfo');
  const progressBar = document.getElementById('progressBar');

  const FORMAT_BY_EXT = {mscz:'mscz', mscx:'mscx', mxl:'mxl', musicxml:'musicxml', xml:'xml',
    mid:'midi', midi:'midi', kar:'kar', gtp:'gtp', gp3:'gp3', gp4:'gp4', gp5:'gp5', gpx:'gpx', gp:'gp', ptb:'ptb'};

  function readFormat(file) {
    const extension = file.name.split('.').pop().toLowerCase();
    const format = FORMAT_BY_EXT[extension];
    if (!format) {
      progressInfo.textContent = `Unsupported file type ".${extension}" — accepted: .mscz, .mscx, .musicxml, .xml, .mxl, .mid, .midi, .kar, .gp, .gp3–.gp5, .ptb`;
      return null;
    }
    return format;
  }

  const to = new URLSearchParams(location.search).get('to');
  if (to && Array.from(outputFormatSelect.options).some(option => option.value === to)) {
    outputFormatSelect.value = to;
    outputFormatSelect.dispatchEvent(new Event('change'));
  }

  // Function to update progress
  function updateProgress(percent, message = null) {
    progressBar.style.width = `${percent}%`;
    if (message) {
      progressInfo.textContent = message;
    }
  }

  // Enable convert button when file is selected
  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      fileName = fileInput.files[0].name.split('.')[0];
      convertBtn.disabled = false;
      downloadBtn.disabled = true;
      progressInfo.textContent = `File "${fileInput.files[0].name}" selected.`;
      convertedData = null;
      updateProgress(0);
    }
  });

  // Convert button click handler
  convertBtn.addEventListener('click', async () => {
    if (!fileInput.files.length) return;

    const file = fileInput.files[0];
    const outputFormat = document.getElementById('outputFormat').value;
    const in_fmt = readFormat(file);
    if (!in_fmt) return;
    const out_fmt = outputFormat;
    const t0 = performance.now();
    let stage = 'load';
    const isAudio = ['mp3', 'wav', 'flac', 'ogg'].includes(outputFormat);
    const timeout = (work, ms, msg) => Promise.race([work, new Promise((_,rej)=>setTimeout(()=>rej(new Error(msg)),ms))]);

    try {
      convertBtn.disabled = true;
      updateProgress(10, 'Loading file...');
      if (typeof gtag === 'function') gtag('event','convert_start',{in_fmt, out_fmt, size_kb: Math.round(file.size/1024)});

      // Read the file
      const arrayBuffer = await file.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);

      // Create a score from the file
      updateProgress(30, 'Creating score from file...');
      const score = await timeout(window.WebMscore.load(in_fmt, data), 45000, 'Error: the score took longer than 45s to parse. Large or damaged files can do this.');
      updateProgress(50, 'File loaded successfully.');

      updateProgress(60, `Converting to ${outputFormat}...`);

      stage = isAudio ? 'soundfont' : 'export';
      const exportWork = (async () => {
      switch (outputFormat) {
        case 'mscz':
          convertedData = await score.saveMsc('mscz');
          break;
        case 'mscx':
          convertedData = await score.saveMsc('mscx');
          break;
        case 'musicxml':
          convertedData = await score.saveXml();
          break;
        case 'pdf':
          convertedData = await score.savePdf();
          break;
        case 'midi':
          convertedData = await score.saveMidi();
          break;
        case 'mp3':
          // Audio conversion can take longer, so update the progress
          updateProgress(65, `Converting to MP3 (this may take a while)...`);
          {
            const res = await fetch('https://cdn.jsdelivr.net/gh/musescore/MuseScore@2.1/share/sound/FluidR3Mono_GM.sf3');
            if (!res.ok) throw new Error(`Error: could not download the soundfont (HTTP ${res.status})`);
            await score.setSoundFont(new Uint8Array(await res.arrayBuffer()));
          }
          stage = 'export';
          convertedData = await score.saveAudio('mp3');
          break;
        case 'wav':
          updateProgress(65, `Converting to WAV (this may take a while)...`);
          {
            const res = await fetch('https://cdn.jsdelivr.net/gh/musescore/MuseScore@2.1/share/sound/FluidR3Mono_GM.sf3');
            if (!res.ok) throw new Error(`Error: could not download the soundfont (HTTP ${res.status})`);
            await score.setSoundFont(new Uint8Array(await res.arrayBuffer()));
          }
          stage = 'export';
          convertedData = await score.saveAudio('wav');
          break;
        case 'flac':
          updateProgress(65, `Converting to FLAC (this may take a while)...`);
          {
            const res = await fetch('https://cdn.jsdelivr.net/gh/musescore/MuseScore@2.1/share/sound/FluidR3Mono_GM.sf3');
            if (!res.ok) throw new Error(`Error: could not download the soundfont (HTTP ${res.status})`);
            await score.setSoundFont(new Uint8Array(await res.arrayBuffer()));
          }
          stage = 'export';
          convertedData = await score.saveAudio('flac');
          break;
        case 'ogg':
          updateProgress(65, `Converting to OGG (this may take a while)...`);
          {
            const res = await fetch('https://cdn.jsdelivr.net/gh/musescore/MuseScore@2.1/share/sound/FluidR3Mono_GM.sf3');
            if (!res.ok) throw new Error(`Error: could not download the soundfont (HTTP ${res.status})`);
            await score.setSoundFont(new Uint8Array(await res.arrayBuffer()));
          }
          stage = 'export';
          convertedData = await score.saveAudio('ogg');
          break;
        case 'png':
          // Get all PNG pages
          const metadata = await score.metadata();
          const pngDataArray = [];

          for (let i = 0; i < metadata.pages; i++) {
            updateProgress(60 + Math.floor((i / metadata.pages) * 25),
              `Generating PNG ${i + 1}/${metadata.pages}...`);
            pngDataArray.push(await score.savePng(i));
          }
          convertedData = pngDataArray[0]; // Just use first page for download

          // Display all PNG pages
          updateProgress(85, 'Preparing PNG preview...');
          for (let i = 0; i < pngDataArray.length; i++) {
            const img = document.createElement('img');
            const blob = new Blob([pngDataArray[i]], { type: 'image/png' });
            img.src = URL.createObjectURL(blob);
            img.style.width = '100%';
            img.style.marginBottom = '10px';
          }
          break;
      }
      })();
      if (isAudio) {
        await timeout(exportWork, 120000, 'Error: audio rendering timed out.');
      } else {
        await exportWork;
      }

      // Display preview for some formats
      if (outputFormat === 'pdf') {
        updateProgress(85, 'Preparing PDF preview...');
      }

      updateProgress(100, 'Conversion completed successfully!');
      downloadBtn.disabled = false;
      const ms = Math.round(performance.now() - t0);
      const out_bytes = convertedData.byteLength ?? convertedData.length;
      if (typeof gtag === 'function') gtag('event','convert_success',{in_fmt, out_fmt, ms, out_bytes, out_kb: Math.round(out_bytes/1024)});

      // Clean up
      await score.destroy();

    } catch (e) {
      const ms = Math.round(performance.now() - t0);
      progressInfo.textContent = 'Error: ' + e.message;
      console.error(e);
      downloadBtn.disabled = true;
      updateProgress(0);
      if (typeof gtag === 'function') gtag('event','convert_error',{in_fmt, out_fmt, ms, stage, error_type: e.message.slice(0,60)});
    } finally {
      convertBtn.disabled = false;
    }
  });

  // Download button click handler
  downloadBtn.addEventListener('click', () => {
    if (!convertedData) return;

    const outputFormat = document.getElementById('outputFormat').value;
    let mimeType, fileExtension;

    switch (outputFormat) {
      case 'mscz':
        mimeType = 'application/octet-stream';
        fileExtension = 'mscz';
        break;
      case 'musicxml':
        mimeType = 'application/xml';
        fileExtension = 'musicxml';
        break;
      case 'pdf':
        mimeType = 'application/pdf';
        fileExtension = 'pdf';
        break;
      case 'midi':
        mimeType = 'audio/midi';
        fileExtension = 'mid';
        break;
      case 'mp3':
        mimeType = 'audio/mpeg';
        fileExtension = 'mp3';
        break;
      case 'wav':
        mimeType = 'audio/wav';
        fileExtension = 'wav';
        break;
      case 'flac':
        mimeType = 'audio/flac';
        fileExtension = 'flac';
        break;
      case 'ogg':
        mimeType = 'audio/ogg';
        fileExtension = 'ogg';
        break;
      case 'png':
        mimeType = 'image/png';
        fileExtension = 'png';
        break;
    }

    const blob = new Blob([convertedData], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.${fileExtension}`;
    document.body.appendChild(a);
    a.click();

    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  });
});
