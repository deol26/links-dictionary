# Link Directory

A simple, clean link directory website that works perfectly on GitHub Pages.

## Features

- 📋 Clean list of curated links
- 🔍 Real-time search functionality
- 🏷️ Category filtering (News, Videos, Products, Social, Other)
- 📤 Easy submission system via GitHub Issues
- 📱 Fully responsive design
- 🚀 No backend required - works on GitHub Pages

## Setup Instructions

### 1. Deploy to GitHub Pages

1. Create a new repository on GitHub
2. Upload all files to the repository:
   - index.html
   - submit.html
   - links.json
   - script.js
   - submit.js
   - styles.css
   - README.md

3. Go to **Settings** → **Pages**
4. Set source to **main branch**
5. Your site will be live at: `https://your-username.github.io/your-repo/`

### 2. Configure Repository Settings

Edit `admin.js` (lines 8-9) and `submit.js` (lines 24-25):
```javascript
const GITHUB_OWNER = 'YOUR-USERNAME'; // Your GitHub username
const GITHUB_REPO = 'YOUR-REPO';     // Your repository name
```

### 3. Add New Links

**Option A: Admin Panel (Easiest - Recommended!)**
1. Go to `admin.html` on your site
2. Get a GitHub Personal Access Token:
   - Go to [GitHub Settings → Tokens](https://github.com/settings/tokens)
   - Generate new token (classic) with `repo` scope
   - Save token in admin panel
3. Fill out the form and click "Auto-Publish to GitHub"
4. Done! Link is live instantly!

**Option B: Via Public Submission Form**
- Users fill out the form on `submit.html`
- Click "Generate GitHub Issue"
- You review and use admin panel to publish

**Option C: Direct Edit**
- Edit `links.json` directly on GitHub
- Add new link following this format:
```json
{
  "id": 9,
  "title": "Your Link Title",
  "url": "https://example.com",
  "description": "Brief description",
  "category": "news",
  "tags": ["tag1", "tag2"],
  "date": "2026-01-04"
}Public submission page
├── admin.html       # Admin panel for adding links (NEW!)
├── links.json       # Data file (all links stored here)
├── script.js        # Main page functionality
├── submit.js        # Submission form logic
├── admin.js         # Admin panel logic (NEW!)
## File Structure

```
├── index.html       # Main page with link list
├── submit.html      # Submission page
├── links.json       # Data file (all links stored here)
├── script.js        # Main page functionality
├── submit.js        # Submission form logic
├── styles.css       # All styling
└── README.md        # This file
```

## Categories

- **news** - Breaking news and articles
- **videos** - YouTube, TikTok, video content
- **products** - Product launches, deals
- **social** - Tweets, Reddit posts, social media
- **other** - Everything else

## Customization

### Change Colors
Edit `styles.css` and modify the gradient colors:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Add More Categories
1. Add button in `index.html`:
```html
<button class="filter-btn" data-category="newcategory">New Category</button>
```

2. Add styling in `styles.css`:
```css
.category-badge.newcategory { background: #color; color: #textcolor; }
```

## Tips

- Keep `links.json` organized (newest first)
- Use consistent date format: YYYY-MM-DD
- Add descriptive tags for better search
- Review GitHub Issues regularly for new submissions

## License

Free to use and modify!
