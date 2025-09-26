// Advanced JavaScript with pagination and posts display
let currentPage = 1;
const itemsPerPage = 8;
let filteredItems = [];
let allItems = [];
let championsExpanded = true; // Start expanded

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    
    // Try to load champions for sidebar immediately, or wait a bit
    let retryCount = 0;
    const maxRetries = 50;
    
    function tryLoadChampions() {
        console.log(`Trying to load champions (attempt ${retryCount + 1}/${maxRetries})`);
        console.log('Current contentData:', window.contentData ? window.contentData.length : 'not loaded');
        
        if (window.contentData && window.contentData.length > 0) {
            console.log('Found champion data:', window.contentData.length, 'champions');
            setupChampionsSidebar();
        } else if (retryCount < maxRetries) {
            retryCount++;
            console.log('Champions data not ready, retrying in 200ms...');
            setTimeout(tryLoadChampions, 200);
        } else {
            console.log('Failed to load champions after', maxRetries, 'attempts');
            // Force setup with empty data to show loading message
            setupChampionsSidebar();
        }
    }
    tryLoadChampions();
    
    // Initialize with loading message
    document.getElementById('contentGrid').innerHTML = '<div class="no-results">Loading posts...</div>';
    
    setupFilters();
    setupChampionSearch();
});

// Listen for posts ready event
document.addEventListener('postsReady', function(event) {
    console.log('📰 Posts system ready with', event.detail.postsCount, 'posts');
    displayItems();
});

// Main function to display items (posts or champions)
window.displayItems = function() {
    console.log('🔄 displayItems called');
    
    // Use new content data system that prioritizes posts over fallback champions
    if (window.getContentData && typeof window.getContentData === 'function') {
        allItems = window.getContentData();
        console.log('Using getContentData:', allItems.length, 'items');
        
        // Check if we got posts or fallback champions
        if (window.contentDataManager && window.contentDataManager.isReady && window.contentDataManager.posts.length > 0) {
            updateSectionHeader('📰', 'ALL POSTS');
        } else {
            updateSectionHeader('⚔️', 'Champions');
        }
    } else if (window.contentDataManager && window.contentDataManager.isReady) {
        allItems = window.contentDataManager.getAllPosts();
        console.log('Using contentDataManager:', allItems.length, 'posts');
        updateSectionHeader('📰', 'ALL POSTS');
    } else {
        console.log('Falling back to contentData');
        allItems = window.contentData || [];
        updateSectionHeader('⚔️', 'Champions');
    }
    
    filteredItems = [...allItems];
    
    if (allItems.length > 0) {
        renderItems();
        setupPagination();
    } else {
        document.getElementById('contentGrid').innerHTML = '<div class="no-results">No content available</div>';
    }
    
    // Setup filters and search after content is loaded
    setupFilters();
    setupChampionSearch();
};

function updateSectionHeader(icon, title) {
    const sectionHeader = document.querySelector('.section-header h2');
    if (sectionHeader) {
        sectionHeader.innerHTML = `${icon} ${title}`;
    }
}

function setupChampionsSidebar() {
    const championsList = document.getElementById('championsList');
    const champions = window.contentData || [];
    
    console.log('Setting up champions sidebar. Champions count:', champions.length);
    
    if (!championsList) {
        console.log('Champions list container not found');
        return;
    }
    
    if (champions.length === 0) {
        console.log('No champions data available');
        championsList.innerHTML = '<div class="loading-champions">No champions data</div>';
        return;
    }
    
    // Update section title and icon
    const sectionIcon = document.getElementById('sectionIcon');
    const sectionTitle = document.getElementById('sectionTitle');
    
    if (sectionIcon) sectionIcon.textContent = '⚔️';
    if (sectionTitle) sectionTitle.textContent = `Champions (${champions.length})`;
    
    // Fill champions list using the same method as admin.html
    championsList.innerHTML = champions.map(champion => `
        <div class="champion-item" data-champion="${champion.title}" onclick="selectChampion('${champion.title}')">
            <img src="${champion.image}" alt="${champion.title}" class="champion-avatar"
                 onerror="this.src='https://via.placeholder.com/24x24?text=⚔️'">
            <span class="champion-fallback" style="display:none;">⚔️</span>
            <span class="champion-name">${champion.title}</span>
        </div>
    `).join('');
    
    console.log('Champions sidebar setup complete');
}

function toggleChampions() {
    const chevron = document.querySelector('.chevron');
    const championsList = document.getElementById('championsList');
    
    if (chevron && championsList) {
        const isExpanded = chevron.textContent === '▲';
        chevron.textContent = isExpanded ? '▼' : '▲';
        championsList.style.display = isExpanded ? 'none' : 'block';
    }
}

function selectChampion(championName) {
    console.log('Champion clicked:', championName);
    
    // Check if champion is already selected
    const selectedItem = document.querySelector(`[data-champion="${championName}"]`);
    const isAlreadySelected = selectedItem && selectedItem.classList.contains('selected');
    
    if (isAlreadySelected) {
        // Deselect champion - show all content
        console.log('Deselecting champion:', championName);
        selectedItem.classList.remove('selected');
        
        // Reset to show all posts/content
        if (window.PostsManager && window.PostsManager.getAllPosts) {
            filteredItems = window.PostsManager.getAllPosts();
            updateSectionHeader('📰', 'All Posts');
        } else {
            filteredItems = window.contentData || [];
            updateSectionHeader('🎮', 'All Champions');
        }
        
        // Update display after deselection
        currentPage = 1;
        renderItems();
        setupPagination();
    } else {
        // Select new champion
        console.log('Selecting champion:', championName);
        
        // Remove previous selection
        document.querySelectorAll('.champion-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        // Add selection to clicked champion
        if (selectedItem) {
            selectedItem.classList.add('selected');
        }
        
        // If we're showing posts, filter by champion tag
        if (window.PostsManager && window.PostsManager.getAllPosts) {
            const allPosts = window.PostsManager.getAllPosts();
            filteredItems = allPosts.filter(post => 
                post.tags && post.tags.some(tag => tag.toLowerCase().includes(championName.toLowerCase()))
            );
            
            updateSectionHeader('📰', `Posts for ${championName.toUpperCase()}`);
        } else {
            // If we're showing champions, filter by selected champion
            const allChampions = window.contentData || [];
            filteredItems = allChampions.filter(champion => champion.title === championName);
            
            updateSectionHeader('⚔️', championName);
        }
    }
    
    currentPage = 1;
    renderItems();
    setupPagination();
}

function setupFilters() {
    // Role filter
    const roleFilter = document.getElementById('roleFilter');
    if (roleFilter) {
        roleFilter.addEventListener('change', function() {
            applyFilters();
        });
    }
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            applyFilters();
        });
    }
    
    // Clear filters button
    const clearBtn = document.getElementById('clearFilters');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            if (roleFilter) roleFilter.value = 'all';
            if (searchInput) searchInput.value = '';
            
            // Reset to all items
            if (window.PostsManager && window.PostsManager.getAllPosts) {
                filteredItems = window.PostsManager.getAllPosts();
                updateSectionHeader('📰', 'All Posts');
            } else {
                filteredItems = window.contentData || [];
                updateSectionHeader('⚔️', 'All Champions');
            }
            
            // Clear champion selection
            document.querySelectorAll('.champion-item').forEach(item => {
                item.classList.remove('selected');
            });
            
            currentPage = 1;
            renderItems();
            setupPagination();
        });
    }
}

function applyFilters() {
    const roleFilter = document.getElementById('roleFilter');
    const searchInput = document.getElementById('searchInput');
    
    let baseItems;
    if (window.PostsManager && window.PostsManager.getAllPosts) {
        baseItems = window.PostsManager.getAllPosts();
    } else {
        baseItems = window.contentData || [];
    }
    
    filteredItems = baseItems.filter(item => {
        let matchesRole = true;
        let matchesSearch = true;
        
        // Role filter
        if (roleFilter && roleFilter.value !== 'all') {
            if (item.championData && item.championData.tags) {
                matchesRole = item.championData.tags.includes(roleFilter.value);
            } else if (item.tags) {
                matchesRole = item.tags.some(tag => tag.toLowerCase().includes(roleFilter.value.toLowerCase()));
            }
        }
        
        // Search filter
        if (searchInput && searchInput.value.trim()) {
            const searchTerm = searchInput.value.toLowerCase();
            matchesSearch = 
                item.title.toLowerCase().includes(searchTerm) ||
                item.description.toLowerCase().includes(searchTerm) ||
                (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchTerm))) ||
                (item.championData && item.championData.title.toLowerCase().includes(searchTerm));
        }
        
        return matchesRole && matchesSearch;
    });
    
    currentPage = 1;
    renderItems();
    setupPagination();
}

function renderItems() {
    const contentGrid = document.getElementById('contentGrid');
    if (!contentGrid) {
        console.log('Content grid not found');
        return;
    }
    
    if (filteredItems.length === 0) {
        contentGrid.innerHTML = '<div class="no-results">No results found</div>';
        return;
    }
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageItems = filteredItems.slice(startIndex, endIndex);
    
    console.log(`Rendering page ${currentPage}: items ${startIndex}-${endIndex} of ${filteredItems.length}`);
    
    contentGrid.innerHTML = pageItems.map(item => {
        // Check if this is a post or champion
        if (item.createdAt && item.author) {
            // This is a post
            return `
                <div class="content-card">
                    <div class="content-image">
                        <img src="${item.image || 'assets/logo.png'}" alt="${item.title}" class="champion-card-image" 
                             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        <div class="image-placeholder" style="display:none;">
                            <span>📰</span>
                        </div>
                    </div>
                    <div class="content-info">
                        <h3 class="content-title">${item.title}</h3>
                        <span class="content-type ${item.type ? item.type.toLowerCase() : 'free'}">${item.type || 'Free'}</span>
                        <p class="content-description">${item.description}</p>
                        <div class="content-meta">
                            <span class="content-category">📂 ${item.category}</span>
                            <span class="content-author">👤 ${item.author}</span>
                            <span class="content-date">📅 ${new Date(item.createdAt).toLocaleDateString()}</span>
                            <span class="content-price">${item.price ? `💰 ${item.price} ${item.currency}` : '<span class="free-icon">●</span> Free'}</span>
                        </div>
                        <div class="content-tags">
                            ${item.tags.slice(0, 3).map(tag => `<span class="content-tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `;
        } else {
            // This is a champion
            return `
                <div class="content-card">
                    <div class="content-image">
                        <img src="${item.image}" alt="${item.title}" class="champion-card-image" 
                             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        <div class="image-placeholder" style="display:none;">
                            <span>⚔️</span>
                        </div>
                    </div>
                    <div class="content-info">
                        <h3 class="content-title">${item.title}</h3>
                        ${item.championData ? `<p class="champion-subtitle">${item.championData.title}</p>` : ''}
                        <p class="content-description">${item.description}</p>
                        <div class="content-tags">
                            ${item.tags.slice(0, 3).map(tag => `<span class="content-tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `;
        }
    }).join('');
}

function setupPagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    if (currentPage > 1) {
        paginationHTML += `<button class="pagination-btn" onclick="goToPage(${currentPage - 1})">Previous</button>`;
    }
    
    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    if (startPage > 1) {
        paginationHTML += `<button class="pagination-btn" onclick="goToPage(1)">1</button>`;
        if (startPage > 2) {
            paginationHTML += `<span class="pagination-ellipsis">...</span>`;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<span class="pagination-ellipsis">...</span>`;
        }
        paginationHTML += `<button class="pagination-btn" onclick="goToPage(${totalPages})">${totalPages}</button>`;
    }
    
    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `<button class="pagination-btn" onclick="goToPage(${currentPage + 1})">Next</button>`;
    }
    
    pagination.innerHTML = paginationHTML;
}

function goToPage(page) {
    currentPage = page;
    renderItems();
    setupPagination();
    
    // Scroll to top of content
    const contentGrid = document.getElementById('contentGrid');
    if (contentGrid) {
        contentGrid.scrollIntoView({ behavior: 'smooth' });
    }
}

function setupChampionSearch() {
    const championSearch = document.getElementById('championSearch');
    if (!championSearch) return;
    
    championSearch.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        const championsList = document.getElementById('championsList');
        if (!championsList) return;
        
        const championItems = championsList.querySelectorAll('.champion-item');
        championItems.forEach(item => {
            const championName = item.querySelector('.champion-name').textContent.toLowerCase();
            if (championName.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

// Global functions for navigation
window.toggleChampions = toggleChampions;
window.selectChampion = selectChampion;
window.goToPage = goToPage;