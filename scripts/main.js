// Simple and direct approach
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    
    // Initialize immediately with fallback data
    if (window.contentData && window.contentData.length > 0) {
        console.log('Found content data:', window.contentData.length, 'champions');
        renderChampions();
        setupChampionsList();
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
    
    const champions = window.contentData || [];
    console.log('Rendering', champions.length, 'champions to content grid');
    
    if (champions.length === 0) {
        contentGrid.innerHTML = '<div class="no-results">No champions found</div>';
        return;
    }
    
    contentGrid.innerHTML = champions.slice(0, 8).map(champion => `
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
                ${champion.championData ? `<p class="champion-subtitle">${champion.championData.title}</p>` : ''}
                <p class="content-description">${champion.description}</p>
                <div class="content-tags">
                    ${champion.tags.slice(0, 2).map(tag => `<span class="content-tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

function setupChampionsList() {
    const championsList = document.getElementById('championsList');
    if (!championsList) {
        console.log('Champions list not found');
        return;
    }
    
    const champions = window.contentData || [];
    console.log('Setting up champions list with', champions.length, 'champions');
    
    championsList.innerHTML = champions.map(champion => `
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
        const championSearch = document.getElementById('championSearch');
        if (championSearch) {
            championSearch.addEventListener('input', (e) => {
                this.filterChampions(e.target.value.toLowerCase());
            });
        }

        // Pagination
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.renderContent();
                    this.updatePagination();
                }
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
                if (this.currentPage < totalPages) {
                    this.currentPage++;
                    this.renderContent();
                    this.updatePagination();
                }
            });
        }
    }

    renderChampionsList() {
        const championsList = document.getElementById('championsList');
        if (!championsList || !this.filteredChampions.length) {
            if (championsList) {
                championsList.innerHTML = '<div class="loading-champions">No champions found</div>';
            }
            return;
        }

        console.log('Rendering champions list:', this.filteredChampions.length, 'champions');

        championsList.innerHTML = this.filteredChampions.map(champion => `
            <div class="champion-item" data-champion-id="${champion.id}">
                <input type="checkbox" class="champion-checkbox" id="champ-${champion.id}" 
                       ${this.activeFilters.selectedChampions.includes(champion.id) ? 'checked' : ''}>
                <img src="${champion.image}" alt="${champion.title}" class="champion-icon" 
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHZpZXdCb3g9IjAgMCAyOCAyOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI4IiBoZWlnaHQ9IjI4IiBmaWxsPSIjNDQ0IiByeD0iNCIvPgo8dGV4dCB4PSIxNCIgeT0iMTgiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgZmlsbD0iIzg4OCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+4q2QPC90ZXh0Pgo8L3N2Zz4K'">
                <label for="champ-${champion.id}" class="champion-name">${champion.title}</label>
            </div>
        `).join('');

        // Add event listeners to champion checkboxes
        const championCheckboxes = championsList.querySelectorAll('.champion-checkbox');
        championCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const championId = parseInt(e.target.id.replace('champ-', ''));
                if (e.target.checked) {
                    if (!this.activeFilters.selectedChampions.includes(championId)) {
                        this.activeFilters.selectedChampions.push(championId);
                    }
                } else {
                    this.activeFilters.selectedChampions = this.activeFilters.selectedChampions.filter(id => id !== championId);
                }
                console.log('Selected champions:', this.activeFilters.selectedChampions);
                this.applyFilters();
            });
        });
    }

    filterChampions(searchTerm) {
        this.filteredChampions = this.allChampions.filter(champion => 
            champion.title.toLowerCase().includes(searchTerm) ||
            champion.description.toLowerCase().includes(searchTerm)
        );
        this.renderChampionsList();
    }

    applyFilters() {
        if (!window.contentData || window.contentData.length === 0) return;

        this.filteredData = window.contentData.filter(item => {
            // If no champions are selected, show all champions
            const matchesChampion = this.activeFilters.selectedChampions.length === 0 || 
                                  this.activeFilters.selectedChampions.includes(item.id);
            const matchesSearch = this.activeFilters.search === '' || 
                                item.title.toLowerCase().includes(this.activeFilters.search) ||
                                item.description.toLowerCase().includes(this.activeFilters.search) ||
                                item.tags.some(tag => tag.toLowerCase().includes(this.activeFilters.search));
            
            return matchesChampion && matchesSearch;
        });

        console.log('Filtered data:', this.filteredData.length, 'items');
        this.currentPage = 1;
        this.renderContent();
        this.updatePagination();
    }

    renderContent() {
        const contentGrid = document.getElementById('contentGrid');
        if (!contentGrid) {
            console.log('Content grid not found');
            return;
        }

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageData = this.filteredData.slice(startIndex, endIndex);

        console.log('Rendering content:', pageData.length, 'items on page', this.currentPage);

        if (pageData.length === 0) {
            contentGrid.innerHTML = `
                <div class="no-results" style="grid-column: 1 / -1;">
                    <h3>No champions found</h3>
                    <p>Try adjusting your search terms or select champions from the sidebar.</p>
                </div>
            `;
            return;
        }

        contentGrid.innerHTML = pageData.map(item => `
            <a href="post.html?id=${item.id}" class="content-card">
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
                        ${item.tags.slice(0, 2).map(tag => `<span class="content-tag">${tag}</span>`).join('')}
                    </div>
                    <div class="content-meta">
                        <span class="content-type">${this.capitalizeFirst(item.type)}</span>
                        <span class="content-size">⭐ ${item.championData?.difficulty || 5}/10</span>
                    </div>
                </div>
            </a>
        `).join('');
    }

    getSizeLabel(size) {
        const labels = {
            'small': 'Easy',
            'medium': 'Medium', 
            'large': 'Hard'
        };
        return labels[size] || size;
    }

    setupPagination() {
        this.updatePagination();
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
        const paginationNumbers = document.getElementById('paginationNumbers');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        if (!paginationNumbers) return;

        // Update button states
        if (prevBtn) prevBtn.disabled = this.currentPage === 1;
        if (nextBtn) nextBtn.disabled = this.currentPage === totalPages || totalPages === 0;

        // Generate page numbers
        let numbers = '';
        const maxVisible = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);

        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            numbers += `
                <button class="pagination-number ${i === this.currentPage ? 'active' : ''}" 
                        onclick="contentManager.goToPage(${i})">${i}</button>
            `;
        }

        paginationNumbers.innerHTML = numbers;
    }

    goToPage(page) {
        this.currentPage = page;
        this.renderContent();
        this.updatePagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.contentManager = new ContentManager();
});