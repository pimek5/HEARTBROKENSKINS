// Admin Panel JavaScript
const ADMIN_CREDENTIALS = {
    username: 'p1mek',
    password: 'Karasinski1'
};

let isLoggedIn = false;

// Check if already logged in
document.addEventListener('DOMContentLoaded', function() {
    const savedLogin = sessionStorage.getItem('adminLoggedIn');
    if (savedLogin === 'true') {
        showAdminPanel();
    }
});

function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');
    
    // Clear previous error
    errorDiv.style.display = 'none';
    
    // Validate credentials
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        // Successful login
        sessionStorage.setItem('adminLoggedIn', 'true');
        showAdminPanel();
        
        // Clear form
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        
        console.log('✅ Admin login successful');
    } else {
        // Failed login
        errorDiv.style.display = 'block';
        
        // Add shake animation
        const loginContainer = document.querySelector('.login-container');
        loginContainer.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            loginContainer.style.animation = '';
        }, 500);
        
        console.log('❌ Admin login failed');
    }
}

function showAdminPanel() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    isLoggedIn = true;
    
    // Update statistics
    updateStats();
    
    // Load posts
    loadPosts();
    
    // Add welcome animation
    const adminPanel = document.getElementById('adminPanel');
    adminPanel.style.opacity = '0';
    adminPanel.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        adminPanel.style.transition = 'all 0.5s ease';
        adminPanel.style.opacity = '1';
        adminPanel.style.transform = 'translateY(0)';
    }, 100);
}

function logout() {
    sessionStorage.removeItem('adminLoggedIn');
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    isLoggedIn = false;
    
    console.log('🚪 Admin logged out');
    
    // Show logout message
    showNotification('Logged out successfully', 'info');
}

function updateStats() {
    // Animate numbers counting up
    animateCounter('totalChampions', 174, 2000);
    animateCounter('totalUsers', 1247, 2000);
    
    // Update last update time
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    document.getElementById('lastUpdate').textContent = `${timeString}`;
}

function animateCounter(elementId, target, duration) {
    const element = document.getElementById(elementId);
    const start = 0;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOutCubic);
        
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
        <span class="notification-text">${message}</span>
    `;
    
    // Style notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(${type === 'success' ? '76, 175, 80' : type === 'error' ? '244, 67, 54' : '33, 150, 243'}, 0.5);
        border-radius: 8px;
        padding: 1rem 1.5rem;
        color: #fff;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Show animation
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Admin Functions
function refreshChampions() {
    if (!isLoggedIn) return;
    
    showNotification('Refreshing champions data...', 'info');
    
    // Simulate API call
    setTimeout(() => {
        showNotification('Champions data refreshed successfully!', 'success');
        console.log('🔄 Champions data refreshed');
    }, 1500);
}

function exportChampions() {
    if (!isLoggedIn) return;
    
    showNotification('Exporting champions list...', 'info');
    
    // Create CSV data
    const csvData = [
        ['ID', 'Name', 'Description', 'Category', 'Tags'],
        ...window.contentData?.map(champion => [
            champion.id,
            champion.title,
            champion.description,
            champion.category,
            champion.tags.join('; ')
        ]) || []
    ];
    
    // Convert to CSV
    const csvContent = csvData.map(row => 
        row.map(field => `"${field}"`).join(',')
    ).join('\\n');
    
    // Create download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'champions_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    showNotification('Champions list exported!', 'success');
    console.log('📥 Champions list exported');
}

function updateAPI() {
    if (!isLoggedIn) return;
    
    showNotification('Updating API version...', 'info');
    
    // Simulate API update
    setTimeout(() => {
        showNotification('API version updated to latest!', 'success');
        console.log('🚀 API version updated');
    }, 2000);
}

function clearCache() {
    if (!isLoggedIn) return;
    
    if (confirm('Are you sure you want to clear the cache? This will refresh all data.')) {
        showNotification('Clearing cache...', 'info');
        
        // Clear browser cache
        if ('caches' in window) {
            caches.keys().then(names => {
                names.forEach(name => {
                    caches.delete(name);
                });
            });
        }
        
        // Clear session storage (except login)
        const adminLogin = sessionStorage.getItem('adminLoggedIn');
        sessionStorage.clear();
        sessionStorage.setItem('adminLoggedIn', adminLogin);
        
        setTimeout(() => {
            showNotification('Cache cleared successfully!', 'success');
            console.log('🗑️ Cache cleared');
        }, 1000);
    }
}

function backupData() {
    if (!isLoggedIn) return;
    
    showNotification('Creating backup...', 'info');
    
    // Create backup data
    const backupData = {
        timestamp: new Date().toISOString(),
        champions: window.contentData || [],
        settings: {
            version: '1.0.0',
            apiVersion: '15.19.1'
        }
    };
    
    // Create download
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { 
        type: 'application/json' 
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `heartbrokenskins_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    showNotification('Backup created successfully!', 'success');
    console.log('💾 Data backup created');
}

// Add shake animation CSS
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(shakeStyle);

// Security: Clear console on production
if (location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
    console.clear();
    console.log('%c🛡️ HEARTBROKENSKINS Admin Panel', 'color: #dc143c; font-size: 20px; font-weight: bold;');
    console.log('%c⚠️ Unauthorized access is prohibited', 'color: #ff6b6b; font-size: 14px;');
}

// Posts Management Functions
function loadPosts() {
    if (!isLoggedIn) return;
    
    const postsList = document.getElementById('postsList');
    const posts = window.PostsManager.getAllPosts();
    
    if (posts.length === 0) {
        postsList.innerHTML = '<div style="text-align: center; color: rgba(255,255,255,0.6); padding: 2rem;">No posts found. Create your first post!</div>';
        return;
    }
    
    postsList.innerHTML = posts.map(post => `
        <div class="post-item">
            <img src="${post.image}" alt="${post.title}" class="post-thumbnail" 
                 onerror="this.src='https://via.placeholder.com/60x60?text=📝'">
            <div class="post-info">
                <div class="post-title">${post.title}</div>
                <div class="post-meta">
                    <span>📂 ${post.category}</span>
                    <span>👤 ${post.author}</span>
                    <span>📅 ${new Date(post.createdAt).toLocaleDateString()}</span>
                    ${post.price ? `<span>💰 ${post.price} ${post.currency}</span>` : '<span>� Free</span>'}
                </div>
            </div>
            <div class="post-actions">
                <button class="post-btn edit" onclick="editPost(${post.id})">✏️ Edit</button>
                <button class="post-btn delete" onclick="deletePost(${post.id})">🗑️ Delete</button>
            </div>
        </div>
    `).join('');
}

function showCreatePostModal() {
    if (!isLoggedIn) return;
    
    // Reset form
    document.getElementById('postForm').reset();
    document.getElementById('postId').value = '';
    document.getElementById('modalTitle').textContent = '📝 Create New Post';
    document.getElementById('submitBtnText').textContent = 'Create Post';
    document.getElementById('imagePreview').style.display = 'none';
    
    // Show modal
    document.getElementById('postModal').style.display = 'flex';
    
    // Setup image preview and toggle price field
    setupImagePreview();
    togglePriceField();
}

function editPost(postId) {
    if (!isLoggedIn) return;
    
    const post = window.PostsManager.getPostById(postId);
    if (!post) {
        showNotification('Post not found', 'error');
        return;
    }
    
    // Fill form with post data
    document.getElementById('postId').value = post.id;
    document.getElementById('postTitle').value = post.title;
    document.getElementById('postDescription').value = post.description;
    document.getElementById('postCategory').value = post.category;
    document.getElementById('postImage').value = post.image;
    document.getElementById('postType').value = post.type;
    document.getElementById('postPrice').value = post.price || '';
    document.getElementById('postCurrency').value = post.currency || 'PLN';
    document.getElementById('postTags').value = post.tags.join(', ');
    document.getElementById('postContent').value = post.content;
    
    // Show image preview if exists
    if (post.image) {
        const preview = document.getElementById('imagePreview');
        const previewImg = document.getElementById('previewImg');
        previewImg.src = post.image;
        preview.style.display = 'block';
    }
    
    // Update modal title
    document.getElementById('modalTitle').textContent = '✏️ Edit Post';
    document.getElementById('submitBtnText').textContent = 'Update Post';
    
    // Show modal
    document.getElementById('postModal').style.display = 'flex';
    
    // Setup image preview and toggle price field
    setupImagePreview();
    togglePriceField();
}

function deletePost(postId) {
    console.log('🗑️ Delete request for post ID:', postId);
    console.log('🔐 Login status:', isLoggedIn);
    
    if (!isLoggedIn) {
        console.log('❌ Delete blocked: User not logged in');
        showNotification('You must be logged in to delete posts', 'error');
        return;
    }
    
    const post = window.PostsManager.getPostById(postId);
    console.log('📄 Found post:', post);
    
    if (!post) {
        console.log('❌ Post not found for ID:', postId);
        showNotification('Post not found', 'error');
        return;
    }
    
    console.log('❓ Showing confirmation dialog for:', post.title);
    const confirmed = confirm(`Are you sure you want to delete "${post.title}"?`);
    console.log('✅ User confirmed deletion:', confirmed);
    
    if (confirmed) {
        console.log('🔥 Attempting to delete post...');
        const deleted = window.PostsManager.deletePost(postId);
        console.log('🗑️ Delete result:', deleted);
        
        if (deleted) {
            showNotification('✅ Post deleted! Database updated across all pages.', 'success');
            loadPosts();
            console.log('🎉 Post successfully deleted:', deleted.title);
        } else {
            console.log('❌ Delete failed');
            showNotification('Failed to delete post', 'error');
        }
    } else {
        console.log('❌ User cancelled deletion');
    }
}

function closePostModal() {
    document.getElementById('postModal').style.display = 'none';
}

function handlePostSubmit(event) {
    event.preventDefault();
    
    if (!isLoggedIn) return;
    
    const formData = new FormData(event.target);
    const postData = {
        title: formData.get('title'),
        description: formData.get('description'),
        category: formData.get('category'),
        image: formData.get('image') || 'https://via.placeholder.com/300x200?text=No+Image',
        type: formData.get('type'),
        price: formData.get('price') ? parseFloat(formData.get('price')) : null,
        currency: formData.get('currency') || 'PLN',
        tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag),
        content: formData.get('content'),
        author: 'p1mek'
    };
    
    const postId = formData.get('id');
    
    try {
        if (postId) {
            // Update existing post
            const updated = window.PostsManager.updatePost(postId, postData);
            if (updated) {
                showNotification('Post updated successfully!', 'success');
                console.log('✏️ Post updated:', updated.title);
            } else {
                showNotification('Failed to update post', 'error');
                return;
            }
        } else {
            // Create new post
            const created = window.PostsManager.addPost(postData);
            showNotification('Post created successfully!', 'success');
            console.log('📝 Post created:', created.title);
        }
        
        // Refresh posts list and close modal
        loadPosts();
        closePostModal();
        
        // Database automatically updated across all pages
        showNotification('✅ Post saved! Database updated across all pages.', 'success');
        
    } catch (error) {
        showNotification('Error saving post: ' + error.message, 'error');
        console.error('Error saving post:', error);
    }
}

function setupImagePreview() {
    const imageInput = document.getElementById('postImage');
    const preview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    
    imageInput.addEventListener('input', function() {
        const url = this.value.trim();
        if (url) {
            previewImg.src = url;
            preview.style.display = 'block';
            
            // Handle image load error
            previewImg.onerror = function() {
                preview.style.display = 'none';
                showNotification('Invalid image URL', 'error');
            };
        } else {
            preview.style.display = 'none';
        }
    });
}

function refreshPosts() {
    if (!isLoggedIn) return;
    
    showNotification('Refreshing posts...', 'info');
    
    setTimeout(() => {
        loadPosts();
        showNotification('Posts refreshed successfully!', 'success');
        console.log('🔄 Posts refreshed');
    }, 500);
}

function exportPosts() {
    if (!isLoggedIn) return;
    
    const posts = window.PostsManager.getAllPosts();
    
    if (posts.length === 0) {
        showNotification('No posts to export', 'info');
        return;
    }
    
    showNotification('Exporting posts...', 'info');
    
    // Create CSV data
    const csvData = [
        ['ID', 'Title', 'Description', 'Category', 'Type', 'Tags', 'Author', 'Created At'],
        ...posts.map(post => [
            post.id,
            post.title,
            post.description,
            post.category,
            post.type,
            post.tags.join('; '),
            post.author,
            new Date(post.createdAt).toLocaleString()
        ])
    ];
    
    // Convert to CSV
    const csvContent = csvData.map(row => 
        row.map(field => `"${field}"`).join(',')
    ).join('\\n');
    
    // Create download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'posts_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    showNotification('Posts exported successfully!', 'success');
    console.log('📥 Posts exported');
}

// Close modal on escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closePostModal();
    }
});

// Close modal on overlay click
document.getElementById('postModal').addEventListener('click', function(event) {
    if (event.target === this) {
        closePostModal();
    }
});

// Champion Tags Helper Functions
function toggleChampionDropdown() {
    const dropdown = document.getElementById('championDropdown');
    const isVisible = dropdown.style.display !== 'none';
    
    if (isVisible) {
        dropdown.style.display = 'none';
    } else {
        dropdown.style.display = 'block';
        loadChampionTags();
    }
}

function loadChampionTags() {
    const tagList = document.getElementById('championTagList');
    if (!window.contentData || !tagList) return;
    
    tagList.innerHTML = window.contentData.map(champion => `
        <div class="champion-tag-option" onclick="addChampionTag('${champion.title}')">
            <img src="${champion.image}" alt="${champion.title}" 
                 onerror="this.src='https://via.placeholder.com/24x24?text=⚔️'">
            <span>${champion.title}</span>
        </div>
    `).join('');
}

function filterChampionTags(searchTerm) {
    const tagList = document.getElementById('championTagList');
    if (!window.contentData || !tagList) return;
    
    const filteredChampions = window.contentData.filter(champion => 
        champion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        champion.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    tagList.innerHTML = filteredChampions.map(champion => `
        <div class="champion-tag-option" onclick="addChampionTag('${champion.title}')">
            <img src="${champion.image}" alt="${champion.title}"
                 onerror="this.src='https://via.placeholder.com/24x24?text=⚔️'">
            <span>${champion.title}</span>
        </div>
    `).join('');
}

function addChampionTag(championName) {
    const tagsInput = document.getElementById('postTags');
    if (!tagsInput) return;
    
    let currentTags = tagsInput.value.trim();
    
    // Check if champion is already in tags
    const tagArray = currentTags.split(',').map(tag => tag.trim().toLowerCase());
    if (tagArray.includes(championName.toLowerCase())) {
        showNotification(`${championName} is already in tags`, 'warning');
        return;
    }
    
    // Add champion to tags
    if (currentTags) {
        tagsInput.value = currentTags + ', ' + championName;
    } else {
        tagsInput.value = championName;
    }
    
    // Close dropdown
    document.getElementById('championDropdown').style.display = 'none';
    
    showNotification(`Added "${championName}" to tags`, 'success');
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('championDropdown');
    const button = event.target.closest('.champion-tag-btn');
    
    if (!button && !event.target.closest('.champion-dropdown')) {
        if (dropdown) {
            dropdown.style.display = 'none';
        }
    }
});

// Price field visibility based on type selection
function togglePriceField() {
    const typeSelect = document.getElementById('postType');
    const priceField = document.querySelector('.price-field');
    
    if (typeSelect && priceField) {
        if (typeSelect.value === 'premium') {
            priceField.style.display = 'block';
        } else {
            priceField.style.display = 'none';
            // Clear price when hiding
            document.getElementById('postPrice').value = '';
        }
    }
}

// Setup price field toggle
document.addEventListener('DOMContentLoaded', function() {
    const typeSelect = document.getElementById('postType');
    if (typeSelect) {
        typeSelect.addEventListener('change', togglePriceField);
        // Initial toggle
        setTimeout(togglePriceField, 100);
    }
});