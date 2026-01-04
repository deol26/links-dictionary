// Main page script
let allLinks = [];
let currentCategory = 'all';

// Load links on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadLinks();
    setupEventListeners();
});

// Load links from JSON file
async function loadLinks() {
    try {
        console.log('Fetching links.json...');
        const response = await fetch('links.json');
        
        console.log('Response status:', response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        console.log('Raw response:', text.substring(0, 100));
        
        allLinks = JSON.parse(text);
        console.log('Loaded links:', allLinks.length);
        
        displayLinks(allLinks);
    } catch (error) {
        console.error('Error loading links:', error);
        document.getElementById('linksList').innerHTML = `
            <div class="error" style="padding: 2rem; text-align: center; background: #f8d7da; border-radius: 8px; color: #721c24;">
                <h3>⚠️ Failed to load links</h3>
                <p><strong>Error:</strong> ${error.message}</p>
                <p style="margin-top: 1rem; font-size: 14px;">
                    <strong>Troubleshooting:</strong><br>
                    1. Check browser console (F12) for detailed errors<br>
                    2. Verify links.json exists in the same folder as index.html<br>
                    3. Make sure JSON syntax is valid<br>
                    4. Wait 2-5 minutes for GitHub Pages to deploy changes
                </p>
            </div>
        `;
    }
}

// Setup event listeners
function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        filterLinks(e.target.value, currentCategory);
    });

    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentCategory = e.target.dataset.category;
            filterLinks(searchInput.value, currentCategory);
        });
    });
}

// Filter links by search and category
function filterLinks(searchTerm, category) {
    const filtered = allLinks.filter(link => {
        const matchesCategory = category === 'all' || link.category === category;
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = !searchTerm || 
            link.title.toLowerCase().includes(searchLower) ||
            link.description.toLowerCase().includes(searchLower) ||
            link.tags.some(tag => tag.toLowerCase().includes(searchLower));
        
        return matchesCategory && matchesSearch;
    });

    displayLinks(filtered);
}

// Display links
function displayLinks(links) {
    const linksList = document.getElementById('linksList');
    const noResults = document.getElementById('noResults');

    if (links.length === 0) {
        linksList.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';
    
    linksList.innerHTML = links.map(link => `
        <div class="link-card">
            <div class="link-header">
                <h3><a href="${link.url}" target="_blank" rel="noopener">${link.title}</a></h3>
                <span class="category-badge ${link.category}">${link.category}</span>
            </div>
            ${link.description ? `<p class="link-description">${link.description}</p>` : ''}
            <div class="link-footer">
                <div class="tags">
                    ${link.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <span class="date">${formatDate(link.date)}</span>
            </div>
        </div>
    `).join('');
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
