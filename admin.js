// Admin panel script
// Configure your GitHub repository here:
const GITHUB_OWNER = 'YOUR-USERNAME';  // Change this to your GitHub username
const GITHUB_REPO = 'YOUR-REPO';       // Change this to your repository name
const GITHUB_BRANCH = 'main';          // Usually 'main' or 'master'

// Check authentication status on load
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
    updateGitHubLink();
});

function checkAuthStatus() {
    const token = localStorage.getItem('github_token');
    const authSection = document.getElementById('authSection');
    const autoPublishBtn = document.getElementById('autoPublishBtn');
    
    if (token) {
        authSection.classList.add('authenticated');
        authSection.querySelector('h4').textContent = '✅ GitHub Authenticated';
        autoPublishBtn.disabled = false;
    } else {
        authSection.classList.remove('authenticated');
        autoPublishBtn.disabled = true;
        autoPublishBtn.style.opacity = '0.5';
    }
}

function saveToken() {
    const token = document.getElementById('githubToken').value.trim();
    if (!token) {
        showMessage('Please enter a valid token', 'error');
        return;
    }
    
    localStorage.setItem('github_token', token);
    showMessage('✅ Token saved! You can now auto-publish links.', 'success');
    checkAuthStatus();
    document.getElementById('githubToken').value = '';
}

function updateGitHubLink() {
    const link = document.getElementById('githubFileLink');
    link.href = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/blob/${GITHUB_BRANCH}/links.json`;
}

// Handle form submission
document.getElementById('addLinkForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    generateJSON();
});

function generateJSON() {
    const title = document.getElementById('title').value.trim();
    const url = document.getElementById('url').value.trim();
    const description = document.getElementById('description').value.trim();
    const category = document.getElementById('category').value;
    const tagsInput = document.getElementById('tags').value.trim();
    
    // Parse tags
    const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(t => t) : [];
    
    // Get next ID (you can manually adjust this)
    const nextId = Date.now(); // Using timestamp as unique ID
    
    // Create the link object
    const linkObject = {
        id: nextId,
        title: title,
        url: url,
        description: description || '',
        category: category,
        tags: tags,
        date: new Date().toISOString().split('T')[0] // Today's date in YYYY-MM-DD
    };
    
    // Format as JSON
    const jsonString = JSON.stringify(linkObject, null, 2);
    
    // Display the JSON
    document.getElementById('jsonOutput').textContent = jsonString + ',';
    document.getElementById('outputSection').style.display = 'block';
    
    // Scroll to output
    document.getElementById('outputSection').scrollIntoView({ behavior: 'smooth' });
    
    // Store for auto-publish
    window.currentLinkData = linkObject;
}

function copyJSON() {
    const jsonText = document.getElementById('jsonOutput').textContent;
    navigator.clipboard.writeText(jsonText).then(() => {
        showMessage('✅ JSON copied to clipboard!', 'success');
    }).catch(() => {
        showMessage('❌ Failed to copy. Please select and copy manually.', 'error');
    });
}

function resetForm() {
    document.getElementById('addLinkForm').reset();
    document.getElementById('outputSection').style.display = 'none';
    window.currentLinkData = null;
    document.getElementById('statusMessage').innerHTML = '';
}

async function autoPublish() {
    const token = localStorage.getItem('github_token');
    
    if (!token) {
        showMessage('❌ Please save your GitHub token first!', 'error');
        return;
    }
    
    if (!window.currentLinkData) {
        showMessage('❌ Please generate JSON first by clicking "Generate JSON"', 'error');
        return;
    }
    
    showMessage('⏳ Publishing to GitHub...', 'info');
    
    try {
        // Step 1: Get current links.json content
        const getUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/links.json`;
        const getResponse = await fetch(getUrl, {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (!getResponse.ok) {
            throw new Error(`GitHub API error: ${getResponse.status}`);
        }
        
        const fileData = await getResponse.json();
        const currentContent = JSON.parse(atob(fileData.content));
        
        // Step 2: Add new link at the beginning
        currentContent.unshift(window.currentLinkData);
        
        // Step 3: Update the file
        const updateUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/links.json`;
        const updateResponse = await fetch(updateUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: `Add new link: ${window.currentLinkData.title}`,
                content: btoa(JSON.stringify(currentContent, null, 2)),
                sha: fileData.sha,
                branch: GITHUB_BRANCH
            })
        });
        
        if (!updateResponse.ok) {
            throw new Error(`Failed to update file: ${updateResponse.status}`);
        }
        
        showMessage('✅ Successfully published to GitHub! The link is now live on your site.', 'success');
        
        // Reset form after successful publish
        setTimeout(() => {
            resetForm();
        }, 2000);
        
    } catch (error) {
        console.error('Error:', error);
        showMessage(`❌ Error: ${error.message}. Check console for details.`, 'error');
    }
}

function showMessage(message, type) {
    const statusDiv = document.getElementById('statusMessage');
    statusDiv.className = type === 'error' ? 'error-msg' : 'success-msg';
    statusDiv.textContent = message;
    statusDiv.style.display = 'block';
}
