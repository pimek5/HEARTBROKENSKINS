// Simple and direct approach
let currentPage = 1;
const itemsPerPage = 8;
let filteredChampions = [];
let allChampions = [];

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    
    // Initialize immediately with fallback data
    if (window.contentData && window.contentData.length > 0) {
        console.log('Found content data:', window.contentData.length, 'champions');
        allChampions = window.contentData;
        filteredChampions = [...allChampions];
        renderChampions();
        setupChampionsList();
        setupSearch();
        setupFilters();
        updatePagination();
    } else {
        console.log('No content data found');
    }
});

function renderChampions() {
    const contentGrid = document.getElementById('contentGrid');
    if (!contentGrid) {
        console.log('Content grid not found');
        return;
    }
    
    console.log('Rendering champions, page:', currentPage, 'filtered:', filteredChampions.length);
    
    if (filteredChampions.length === 0) {
        contentGrid.innerHTML = '<div class="no-results">No champions found</div>';
        return;
    }
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageChampions = filteredChampions.slice(startIndex, endIndex);
    
    contentGrid.innerHTML = pageChampions.map(champion => `
        <div class="content-card">
            <div class="content-image">
                <img src="${champion.image}" alt="${champion.title}" class="champion-card-image" 
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="image-placeholder" style="display:none;">
                    <span>⚔️</span>
                </div>
            </div>
            <div class="content-info">
                <h3 class="content-title">${champion.title}</h3>
                <p class="content-description">${champion.description}</p>
                <div class="content-tags">
                    ${champion.tags.slice(0, 2).map(tag => `<span class="content-tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
    
    updatePagination();
}

function setupChampionsList() {
    const championsList = document.getElementById('championsList');
    if (!championsList) {
        console.log('Champions list not found');
        return;
    }
    
    console.log('Setting up champions list with', allChampions.length, 'champions');
    
    championsList.innerHTML = allChampions.map(champion => `
        <div class="champion-item">
            <img src="${champion.image}" alt="${champion.title}" class="champion-icon"
                 onerror="this.src='https://via.placeholder.com/32x32?text=⚔️'">
            <div class="champion-info">
                <div class="champion-name">${champion.title}</div>
            </div>
            <input type="checkbox" class="champion-checkbox" value="${champion.id}">
        </div>
    `).join('');
}

function setupSearch() {
    const searchInput = document.getElementById('championSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            filterChampions(searchTerm);
        });
    }
}

function filterChampions(searchTerm) {
    const champions = window.contentData || [];
    const filteredChampions = champions.filter(champion => 
        champion.title.toLowerCase().includes(searchTerm) ||
        (champion.championData && champion.championData.title.toLowerCase().includes(searchTerm))
    );
    
    // Update champions list
    const championsList = document.getElementById('championsList');
    if (championsList) {
        championsList.innerHTML = filteredChampions.map(champion => `
            <div class="champion-item">
                <img src="${champion.image}" alt="${champion.title}" class="champion-icon"
                     onerror="this.src='https://via.placeholder.com/32x32?text=⚔️'">
                <div class="champion-info">
                    <div class="champion-name">${champion.title}</div>
                    <div class="champion-title">${champion.championData ? champion.championData.title : ''}</div>
                </div>
                <input type="checkbox" class="champion-checkbox" value="${champion.id}">
            </div>
        `).join('');
    }
    
    // Update content grid
    const contentGrid = document.getElementById('contentGrid');
    if (contentGrid) {
        if (filteredChampions.length === 0) {
            contentGrid.innerHTML = '<div class="no-results">No champions found</div>';
        } else {
            contentGrid.innerHTML = filteredChampions.slice(0, 8).map(champion => `
                <div class="content-card">
                    <div class="content-image">
                        <img src="${champion.image}" alt="${champion.title}" class="champion-card-image" 
                             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        <div class="image-placeholder" style="display:none;">
                            <span>⚔️</span>
                        </div>
                    </div>
                    <div class="content-info">
                        <h3 class="content-title">${champion.title}</h3>
                        <p class="content-description">${champion.description}</p>
                        <div class="content-tags">
                            ${champion.tags.slice(0, 2).map(tag => `<span class="content-tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }
}