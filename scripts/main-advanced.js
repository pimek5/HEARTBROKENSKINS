// Advanced JavaScript with pagination and posts display
let currentPage = 1;
const itemsPerPage = 8;
let filteredItems = [];
let allItems = [];
let championsExpanded = true; // Start expanded

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    
    // Try to load champions for sidebar immediately, or wait a bit
    function tryLoadChampions() {
        if (window.contentData && window.contentData.length > 0) {
            console.log('Found champion data:', window.contentData.length, 'champions');
            setupChampionsSidebar();
        } else {
            console.log('Champions data not ready, retrying in 100ms...');
            setTimeout(tryLoadChampions, 100);
        }
    }
    tryLoadChampions();
    
    // Check if we have posts data for main content
    if (window.PostsManager && window.PostsManager.getAllPosts) {
        console.log('Found posts data, using posts for main content');
        allItems = window.PostsManager.getAllPosts();
        filteredItems = [...allItems];
        updateSectionHeader('📰', 'Posts');
        
        if (allItems.length > 0) {
            renderItems();
            setupPagination();
        } else {
            document.getElementById('contentGrid').innerHTML = '<div class="no-results">No posts found</div>';
        }
    } else {
        console.log('No posts data found, using champions for main content');
        allItems = window.contentData || [];
        filteredItems = [...allItems];
        updateSectionHeader('⚔️', 'Champions');
        
        if (allItems.length > 0) {
            renderItems();
            setupPagination();
        } else {
            document.getElementById('contentGrid').innerHTML = '<div class="no-results">No champions found</div>';
        }
    }
    
    setupFilters();
    setupChampionSearch();
});

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
    
    // Fill champions list
    championsList.innerHTML = champions.slice(0, 50).map(champion => `
        <div class="champion-item" data-champion="${champion.id}" onclick="selectChampion('${champion.id}')">
            <img src="${champion.image}" alt="${champion.title}" class="champion-avatar"
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-block';">
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

function selectChampion(championId) {
    console.log('Selected champion:', championId);
    
    // Remove previous selection
    document.querySelectorAll('.champion-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    // Add selection to clicked champion
    const selectedItem = document.querySelector(`[data-champion="${championId}"]`);
    if (selectedItem) {
        selectedItem.classList.add('selected');
    }
    
    // If we're showing posts, filter by champion tag
    if (window.PostsManager && window.PostsManager.getAllPosts) {
        const allPosts = window.PostsManager.getAllPosts();
        filteredItems = allPosts.filter(post => 
            post.tags && post.tags.some(tag => tag.toLowerCase().includes(championId.toLowerCase()))
        );
        
        updateSectionHeader('📰', `Posts for ${championId}`);
    } else {
        // If we're showing champions, filter by selected champion
        const allChampions = window.contentData || [];
        filteredItems = allChampions.filter(champion => champion.id === championId);
        
        updateSectionHeader('⚔️', championId);
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