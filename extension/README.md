# CVDebug Chrome Extension

**LinkedIn Match Scanner** - See your ATS match score while browsing LinkedIn jobs. Never apply to a job you can't win.

## 🎯 Features

- **Real-time Match Score**: See your resume-to-job match percentage instantly on any LinkedIn job posting
- **Missing Keywords Detection**: Identify critical keywords you're missing in 1 second
- **Zero Friction**: No need to leave LinkedIn or copy/paste job descriptions
- **Privacy First**: Your resume is stored locally on your device, never sent to external servers
- **One-Click Optimization**: Jump directly to CVDebug with the job pre-filled

## 📦 Installation

### For Development:

1. Clone the repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `extension` folder from this project

### For Users:

*(Coming soon to Chrome Web Store)*

## 🚀 How to Use

### Step 1: Upload Your Resume
1. Click the CVDebug extension icon in your browser toolbar
2. Paste your resume text or upload a PDF/DOC file
3. Click "Save Resume"

### Step 2: Browse LinkedIn Jobs
1. Go to [LinkedIn Jobs](https://www.linkedin.com/jobs/)
2. Open any job posting
3. The extension automatically analyzes the job and shows your match score

### Step 3: Optimize Your Resume
1. See which keywords you're missing
2. Click "Optimize Resume" to open CVDebug with the job pre-filled
3. Make changes and save

## 🏗️ Technical Architecture

```
extension/
├── manifest.json          # Extension configuration
├── icons/                 # Extension icons (16x16, 48x48, 128x128)
├── src/
│   ├── content.js        # Content script (runs on LinkedIn pages)
│   ├── content.css       # Match widget styles
│   └── background.js     # Background service worker
└── popup/
    ├── popup.html        # Extension popup UI
    ├── popup.css         # Popup styles
    └── popup.js          # Popup logic
```

### Content Script (`content.js`)
- Runs on all `linkedin.com/jobs/*` pages
- Extracts job description from the page
- Calculates match score using keyword analysis
- Injects match widget into the page
- Listens for SPA navigation (LinkedIn is a single-page app)

### Background Service Worker (`background.js`)
- Manages extension lifecycle (install, update)
- Handles cross-tab messaging
- Stores user resume in `chrome.storage.local`
- Updates badge icon based on resume status

### Popup (`popup.html/js/css`)
- Resume upload/management interface
- Statistics display (jobs analyzed, average match)
- Quick actions (open CVDebug, clear resume)

## 🔒 Privacy & Security

- **Local Storage Only**: Your resume is stored in `chrome.storage.local`, never sent to external servers (except CVDebug when you explicitly click "Optimize Resume")
- **No Tracking**: We don't track your browsing or job searches
- **Minimal Permissions**: Only requests access to LinkedIn jobs pages and local storage
- **Open Source**: Full source code available for audit

## 🎨 Match Score Colors

- **🎯 80-100%**: Strong Match (Green) - Apply with confidence
- **✅ 60-79%**: Good Match (Blue) - Worth applying
- **⚠️ 40-59%**: Fair Match (Yellow) - Consider optimizing first
- **❌ 0-39%**: Poor Match (Red) - Optimize before applying

## 🛠️ Development

### Building for Production

```bash
# Zip the extension folder
cd extension
zip -r cvdebug-extension.zip . -x "*.git*" -x "*node_modules*" -x "*.DS_Store"
```

### Testing

1. Make changes to the code
2. Go to `chrome://extensions/`
3. Click the refresh icon on the CVDebug extension card
4. Reload any LinkedIn job page to see changes

### Future Enhancements

- [ ] Integration with CVDebug API for server-side analysis
- [ ] Chrome sync to sync resume across devices
- [ ] Auto-apply tracking (track which jobs you applied to)
- [ ] Email alerts when high-match jobs are posted
- [ ] Support for Indeed, Glassdoor, and other job boards
- [ ] LinkedIn profile optimization suggestions
- [ ] Bulk job analysis (analyze 10+ jobs at once)

## 📝 Version History

### v1.0.0 (Current)
- Initial release
- Real-time match scoring on LinkedIn
- Local resume storage
- Missing keywords detection
- One-click optimization

## 🤝 Contributing

This extension is part of the CVDebug project. Contributions welcome!

## 📄 License

MIT License - See LICENSE file for details

## 🐛 Bug Reports

Found a bug? Please report it at: https://github.com/your-repo/issues

## 💬 Support

- Email: support@cvdebug.com
- Twitter: @cvdebug
- Discord: [Join our community](https://discord.gg/cvdebug)

---

**Made with ❤️ by the CVDebug team**

*Stop guessing. Start matching.*
