document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const modSearch = document.getElementById('modSearch');
    const championSearch = document.getElementById('championSearch');
    const championsList = document.getElementById('championsList');
    const modsGrid = document.getElementById('modsGrid');
    const modsCount = document.getElementById('modsCount');
    const currentlyShowing = document.getElementById('currentlyShowing');
    const pageSize = document.getElementById('pageSize');
    const sortSelect = document.getElementById('sortSelect');
    const pageNumbers = document.getElementById('pageNumbers');
    const prevPageBtn = document.querySelector('.prev-page');
    const nextPageBtn = document.querySelector('.next-page');
    const viewGridBtn = document.querySelector('.view-grid');
    const viewListBtn = document.querySelector('.view-list');

    // State management
    const state = {
        mods: [],
        champions: [],
        filters: {
            search: '',
            champions: new Set(),
            categories: new Set(),
            themes: new Set(),
            features: new Set()
        },
        pagination: {
            currentPage: 1,
            pageSize: 24,
            totalPages: 1
        },
        sort: 'recently-updated',
        viewMode: 'grid'
    };

    // Load champions from Riot API
    async function loadChampions() {
        try {
            const response = await fetch('https://ddragon.leagueoflegends.com/cdn/13.24.1/data/en_US/champion.json');
            const data = await response.json();
            state.champions = Object.values(data.data).sort((a, b) => a.name.localeCompare(b.name));
            renderChampions();
        } catch (error) {
            console.error('Error loading champions:', error);
        }
    }

    // Load mods data
    async function loadMods() {
        try {
            // In a real application, this would be an API call
            // For now, we'll use mock data
            state.mods = [
                {
                    id: 1,
                    title: "Chibi Lulu",
                    description: "Chibi version of Lulu",
                    thumbnail: "path_to_image.jpg",
                    author: "p1mek",
                    champions: ["Lulu"],
                    categories: ["skins"],
                    themes: ["anime"],
                    features: [],
                    stats: {
                        views: 1500,
                        downloads: 300,
                        likes: 50
                    },
                    updatedAt: new Date("2025-10-26T10:00:00"),
                    isGilded: false
                }
            ];
            updateModsCount();
            applyFiltersAndSort();
        } catch (error) {
            console.error('Error loading mods:', error);
        }
    }

    function renderChampions() {
        const searchTerm = championSearch.value.toLowerCase();
        const filteredChampions = state.champions.filter(champion => 
            champion.name.toLowerCase().includes(searchTerm)
        );

        championsList.innerHTML = filteredChampions.map(champion => `
            <div class="champion-item ${state.filters.champions.has(champion.id) ? 'active' : ''}" data-champion="${champion.id}">
                <img src="https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/${champion.id}.png" alt="${champion.name}">
                <span>${champion.name}</span>
            </div>
        `).join('');

        // Add click events to champion items
        document.querySelectorAll('.champion-item').forEach(item => {
            item.addEventListener('click', () => {
                const championId = item.dataset.champion;
                item.classList.toggle('active');
                if (state.filters.champions.has(championId)) {
                    state.filters.champions.delete(championId);
                } else {
                    state.filters.champions.add(championId);
                }
                applyFiltersAndSort();
            });
        });
    }

    function renderMods(mods) {
        const template = state.viewMode === 'grid' ? renderModCard : renderModListItem;
        modsGrid.className = `mods-${state.viewMode}`;
        modsGrid.innerHTML = mods.map(template).join('');
        currentlyShowing.textContent = mods.length;
    }

    function renderModCard(mod) {
        return `
            <div class="mod-card">
                <img src="${mod.thumbnail}" alt="${mod.title}" class="mod-image">
                <div class="mod-content">
                    <h3 class="mod-title">${mod.title}</h3>
                    <div class="mod-meta">
                        <span>by ${mod.author}</span>
                        <div class="mod-stats">
                            <span title="Views"><i class="icon-eye"></i>${formatNumber(mod.stats.views)}</span>
                            <span title="Downloads"><i class="icon-download"></i>${formatNumber(mod.stats.downloads)}</span>
                            <span title="Likes"><i class="icon-heart"></i>${formatNumber(mod.stats.likes)}</span>
                        </div>
                    </div>
                    <div class="mod-tags">
                        ${mod.themes.map(theme => `<span class="mod-tag">${theme}</span>`).join('')}
                    </div>
                    <div class="mod-updated">
                        updated ${formatTimeAgo(mod.updatedAt)}
                    </div>
                </div>
            </div>
        `;
    }

    function renderModListItem(mod) {
        return `
            <div class="mod-list-item">
                <img src="${mod.thumbnail}" alt="${mod.title}" class="mod-thumbnail">
                <div class="mod-info">
                    <h3 class="mod-title">${mod.title}</h3>
                    <p class="mod-description">${mod.description}</p>
                    <div class="mod-meta">
                        <span>by ${mod.author}</span>
                        <div class="mod-stats">
                            <span title="Views">${formatNumber(mod.stats.views)}</span>
                            <span title="Downloads">${formatNumber(mod.stats.downloads)}</span>
                            <span title="Likes">${formatNumber(mod.stats.likes)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function applyFiltersAndSort() {
        let filteredMods = state.mods;

        // Apply search filter
        if (state.filters.search) {
            const searchTerm = state.filters.search.toLowerCase();
            filteredMods = filteredMods.filter(mod =>
                mod.title.toLowerCase().includes(searchTerm) ||
                mod.description.toLowerCase().includes(searchTerm)
            );
        }

        // Apply champion filter
        if (state.filters.champions.size > 0) {
            filteredMods = filteredMods.filter(mod =>
                mod.champions.some(champion => state.filters.champions.has(champion))
            );
        }

        // Apply category filters
        if (state.filters.categories.size > 0) {
            filteredMods = filteredMods.filter(mod =>
                mod.categories.some(category => state.filters.categories.has(category))
            );
        }

        // Apply theme filters
        if (state.filters.themes.size > 0) {
            filteredMods = filteredMods.filter(mod =>
                mod.themes.some(theme => state.filters.themes.has(theme))
            );
        }

        // Apply sorting
        switch (state.sort) {
            case 'recently-updated':
                filteredMods.sort((a, b) => b.updatedAt - a.updatedAt);
                break;
            case 'most-downloaded':
                filteredMods.sort((a, b) => b.stats.downloads - a.stats.downloads);
                break;
            case 'most-viewed':
                filteredMods.sort((a, b) => b.stats.views - a.stats.views);
                break;
            case 'highest-rated':
                filteredMods.sort((a, b) => b.stats.likes - a.stats.likes);
                break;
        }

        // Apply pagination
        const startIndex = (state.pagination.currentPage - 1) * state.pagination.pageSize;
        const endIndex = startIndex + state.pagination.pageSize;
        const modsToShow = filteredMods.slice(startIndex, endIndex);

        // Update pagination
        state.pagination.totalPages = Math.ceil(filteredMods.length / state.pagination.pageSize);
        updatePagination();

        // Render mods
        renderMods(modsToShow);
    }

    function updatePagination() {
        // Update buttons state
        prevPageBtn.disabled = state.pagination.currentPage === 1;
        nextPageBtn.disabled = state.pagination.currentPage === state.pagination.totalPages;

        // Update page numbers
        let pages = [];
        const maxPages = 7;
        const totalPages = state.pagination.totalPages;
        const currentPage = state.pagination.currentPage;

        if (totalPages <= maxPages) {
            pages = Array.from({length: totalPages}, (_, i) => i + 1);
        } else {
            if (currentPage <= 3) {
                pages = [1, 2, 3, 4, '...', totalPages];
            } else if (currentPage >= totalPages - 2) {
                pages = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
            } else {
                pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
            }
        }

        pageNumbers.innerHTML = pages.map(page => {
            if (page === '...') {
                return '<span class="page-ellipsis">...</span>';
            }
            return `<button class="page-number ${page === currentPage ? 'active' : ''}" data-page="${page}">${page}</button>`;
        }).join('');
    }

    function updateModsCount() {
        modsCount.textContent = state.mods.length;
    }

    // Utility functions
    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    function formatTimeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60
        };

        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInUnit);
            if (interval >= 1) {
                return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
            }
        }
        return 'just now';
    }

    // Event Listeners
    modSearch.addEventListener('input', (e) => {
        state.filters.search = e.target.value;
        applyFiltersAndSort();
    });

    championSearch.addEventListener('input', renderChampions);

    sortSelect.addEventListener('change', (e) => {
        state.sort = e.target.value;
        applyFiltersAndSort();
    });

    pageSize.addEventListener('change', (e) => {
        state.pagination.pageSize = parseInt(e.target.value);
        state.pagination.currentPage = 1;
        applyFiltersAndSort();
    });

    prevPageBtn.addEventListener('click', () => {
        if (state.pagination.currentPage > 1) {
            state.pagination.currentPage--;
            applyFiltersAndSort();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        if (state.pagination.currentPage < state.pagination.totalPages) {
            state.pagination.currentPage++;
            applyFiltersAndSort();
        }
    });

    pageNumbers.addEventListener('click', (e) => {
        const pageBtn = e.target.closest('.page-number');
        if (pageBtn) {
            state.pagination.currentPage = parseInt(pageBtn.dataset.page);
            applyFiltersAndSort();
        }
    });

    viewGridBtn.addEventListener('click', () => {
        state.viewMode = 'grid';
        viewGridBtn.classList.add('active');
        viewListBtn.classList.remove('active');
        applyFiltersAndSort();
    });

    viewListBtn.addEventListener('click', () => {
        state.viewMode = 'list';
        viewListBtn.classList.add('active');
        viewGridBtn.classList.remove('active');
        applyFiltersAndSort();
    });

    // Filter category toggles
    document.querySelectorAll('.filter-header').forEach(header => {
        header.addEventListener('click', () => {
            const category = header.closest('.filter-category');
            category.classList.toggle('expanded');
        });
    });

    // Checkbox filters
    document.querySelectorAll('.checkbox-group input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const filterType = e.target.closest('.filter-category').querySelector('.filter-header').dataset.category;
            const value = e.target.value;
            
            if (e.target.checked) {
                state.filters[filterType].add(value);
            } else {
                state.filters[filterType].delete(value);
            }
            applyFiltersAndSort();
        });
    });

    // Initialize
    loadChampions();
    loadMods();
});