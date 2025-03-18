document.addEventListener('DOMContentLoaded', async () => {
  // Initialize WebMScore
  await window.WebMscore.ready;
  document.getElementById('progressInfo').textContent = 'WebMScore initialized successfully!';

  let convertedData = null;
  let fileName = '';
  const convertBtn = document.getElementById('convertBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const fileInput = document.getElementById('musicFile');
  const progressInfo = document.getElementById('progressInfo');
  const progressBar = document.getElementById('progressBar');

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

    try {
      convertBtn.disabled = true;
      updateProgress(10, 'Loading file...');

      // Read the file
      const arrayBuffer = await file.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);

      // Create a score from the file
      updateProgress(30, 'Creating score from file...');
      const score = await window.WebMscore.load('mscz', data);
      updateProgress(50, 'File loaded successfully.');

      updateProgress(60, `Converting to ${outputFormat}...`);

      switch (outputFormat) {
        case 'mscz':
          convertedData = await score.saveMSCZ();
          break;
        case 'musicxml':
          convertedData = await score.saveMusicXML();
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
          convertedData = await score.saveAudio('mp3');
          break;
        case 'wav':
          updateProgress(65, `Converting to WAV (this may take a while)...`);
          convertedData = await score.saveAudio('wav');
          break;
        case 'flac':
          updateProgress(65, `Converting to FLAC (this may take a while)...`);
          convertedData = await score.saveAudio('flac');
          break;
        case 'ogg':
          updateProgress(65, `Converting to OGG (this may take a while)...`);
          convertedData = await score.saveAudio('ogg');
          break;
        case 'png':
          // Get all PNG pages
          const metadata = await score.metadata();
          const pngDataArray = [];
          
          for (let i = 0; i < metadata.pages; i++) {
            updateProgress(60 + Math.floor((i / metadata.pages) * 25), 
              `Generating PNG ${i+1}/${metadata.pages}...`);
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

      // Display preview for some formats
      if (outputFormat === 'pdf') {
        updateProgress(85, 'Preparing PDF preview...');
      }

      updateProgress(100, 'Conversion completed successfully!');
      downloadBtn.disabled = false;

      // Clean up
      await score.destroy();

    } catch (error) {
      progressInfo.textContent = `Error: ${error.message}`;
      console.error(error);
      updateProgress(0);
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