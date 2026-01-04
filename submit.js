// Submit page script
document.getElementById('submitForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const title = document.getElementById('title').value;
    const url = document.getElementById('url').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    const tags = document.getElementById('tags').value;
    
    // Create GitHub issue body
    const issueBody = `
**Link Title:** ${title}

**URL:** ${url}

**Description:** ${description || 'N/A'}

**Category:** ${category}

**Tags:** ${tags || 'N/A'}

---
*Submitted via Link Directory submission form*
    `.trim();
    
    // Replace with your GitHub repo details
    const repoOwner = 'YOUR-USERNAME'; // Change this
    const repoName = 'YOUR-REPO';     // Change this
    
    // Create GitHub issue URL
    const issueUrl = `https://github.com/${repoOwner}/${repoName}/issues/new?title=${encodeURIComponent('New Link: ' + title)}&body=${encodeURIComponent(issueBody)}&labels=link-submission`;
    
    // Show the GitHub link
    document.getElementById('githubLink').style.display = 'block';
    document.getElementById('issueLink').href = issueUrl;
    
    // Scroll to the link
    document.getElementById('githubLink').scrollIntoView({ behavior: 'smooth' });
});
