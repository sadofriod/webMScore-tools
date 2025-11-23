# WebMScore Converter Tool

A simple web-based tool for converting music files between different formats using the WebMScore library.

## Features

- Convert between various music formats:
  - MuseScore format (MSCZ)
  - MusicXML
  - PDF
  - MIDI
  - MP3, WAV, FLAC, OGG (audio formats)
  - PNG

- Preview converted files directly in the browser
- Simple and user-friendly interface

## Usage

1. Open `index.html` in your web browser
2. Upload a music file (supported formats include MSCZ, MSCX, MusicXML, MIDI, etc.)
3. Select the output format
4. Click "Convert" 
5. Once conversion is complete, click "Download Converted File"

## Deployment

### Deploy to Vercel

This project is ready to deploy on Vercel:

1. **Using Vercel CLI:**
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Using Vercel Dashboard:**
   - Fork or import this repository to your GitHub account
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Click "Deploy"

3. **One-Click Deploy:**
   
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sadofriod/webMScore-tools)

The `vercel.json` configuration file is already set up with proper routing and cache headers.

## Dependencies

This tool uses [WebMScore](https://www.npmjs.com/package/webmscore), which is a WebAssembly build of MuseScore.

## License

This project uses the WebMScore library, which is licensed under the GNU General Public License. Please see the WebMScore documentation for details.
