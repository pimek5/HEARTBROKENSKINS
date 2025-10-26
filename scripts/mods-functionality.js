// Mods Page Functionality - Divine Skins Style
class ModsPageManager {
    constructor() {
        // State
        this.allMods = [];
        this.filteredMods = [];
        this.currentPage = 1;
        this.modsPerPage = 20;
        this.currentSort = 'latest';
        this.searchQuery = '';
        this.viewMode = 'grid'; // 'grid' or 'list'
        
        // Filters
        this.filters = {
            categories: new Set(),
            themes: new Set(),
            features: new Set(),
            colors: new Set(),
            champions: new Set(),
            freeOnly: false,
            paidOnly: false
        };
        
        // Initialize
        this.init();
    }
    
    async init() {
        // Wait for content data to be ready
        if (window.contentDataManager && window.contentDataManager.isReady) {
            this.loadMods();
        } else {
            document.addEventListener('contentReady', () => {
                this.loadMods();
            });
        }
        
        this.setupEventListeners();
        this.setupSidebarToggles();
        this.loadChampions();
    }
    
    loadMods() {
        // Get all posts from content data manager
        this.allMods = window.contentDataManager ? window.contentDataManager.getAllPosts() : [];
        console.log('Loaded mods:', this.allMods.length);
        
        // Apply filters and render
        this.applyFilters();
    }
    
    async loadChampions() {
        try {
            console.log('Loading champions from DDragon API...');
            
            // Fetch latest version
            const versionResponse = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
            const versions = await versionResponse.json();
            const latestVersion = versions[0];
            
            console.log('Latest version:', latestVersion);
            
            // Fetch champions data
            const championsResponse = await fetch(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`);
            const championsData = await championsResponse.json();
            
            // Convert to array and sort alphabetically
            const championsArray = Object.values(championsData.data).map(champ => ({
                id: champ.id,
                name: champ.name,
                image: `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${champ.id}.png`
            })).sort((a, b) => a.name.localeCompare(b.name));
            
            console.log('Loaded champions:', championsArray.length);
            
            // Find the champions list container
            const championsSection = Array.from(document.querySelectorAll('.sidebar-content')).find(el => {
                return el.querySelector('input[placeholder*="Search champions"]');
            });
            
            if (!championsSection) {
                console.error('Champions container not found');
                return;
            }
            
            const championsListDiv = championsSection.querySelector('.p-3');
            if (!championsListDiv) {
                console.error('Champions list div not found');
                return;
            }
            
            // Keep the search input
            const searchDiv = championsListDiv.querySelector('.mb-3');
            if (!searchDiv) {
                console.error('Search div not found');
                return;
            }
            
            // Create champion items with checkboxes
            let championsHTML = searchDiv.outerHTML;
            championsArray.forEach(champion => {
                championsHTML += `
                    <div class="flex items-center gap-2">
                        <div class="w-4 h-4 flex items-center justify-center rounded-sm border cursor-pointer bg-transparent border-[#4A4A61] hover:border-[#783CB5]" data-champion-checkbox="${champion.name.toLowerCase()}"></div>
                        <div class="flex items-center gap-2 flex-1">
                            <div class="w-6 h-6 rounded overflow-hidden border border-[#25222F] flex-shrink-0">
                                <img src="${champion.image}" alt="${champion.name}" class="h-full w-full object-cover" onerror="this.src='https://via.placeholder.com/24'">
                            </div>
                            <span class="text-[#CACDD9] hover:text-white cursor-pointer" data-champion="${champion.name.toLowerCase()}">${champion.name}</span>
                        </div>
                    </div>
                `;
            });
            
            // Update the container
            championsListDiv.innerHTML = championsHTML;
            
            // Setup champion search and filters
            this.setupChampionSearch();
            this.setupChampionFilters();
            
        } catch (error) {
            console.error('Error loading champions:', error);
        }
    }
    
    setupChampionSearch() {
        const searchInput = document.querySelector('input[placeholder*="Search champions"]');
        if (!searchInput) return;
        
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const championItems = document.querySelectorAll('[data-champion]');
            
            championItems.forEach(item => {
                const championName = item.dataset.champion;
                const parentDiv = item.closest('.flex.items-center.gap-2');
                if (parentDiv && championName.includes(query)) {
                    parentDiv.style.display = 'flex';
                } else if (parentDiv) {
                    parentDiv.style.display = 'none';
                }
            });
        });
    }
    
    setupChampionFilters() {
        // Setup checkbox toggles for champions
        const checkboxes = document.querySelectorAll('[data-champion-checkbox]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('click', () => {
                const championName = checkbox.dataset.championCheckbox;
                const isActive = checkbox.classList.contains('border-[#783CB5]');
                
                if (isActive) {
                    // Deactivate
                    checkbox.classList.remove('border-[#783CB5]', 'bg-[#783CB5]');
                    checkbox.classList.add('border-[#4A4A61]', 'bg-transparent');
                    checkbox.innerHTML = '';
                    this.filters.champions.delete(championName);
                } else {
                    // Activate
                    checkbox.classList.remove('border-[#4A4A61]', 'bg-transparent');
                    checkbox.classList.add('border-[#783CB5]', 'bg-[#783CB5]');
                    checkbox.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                    this.filters.champions.add(championName);
                }
                
                // Apply filters
                this.currentPage = 1;
                this.applyFilters();
            });
        });
    }
    
    setupEventListeners() {
        // Search
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value;
                this.currentPage = 1;
                this.applyFilters();
            });
        }
        
        // Free/Paid filters
        const freeOnlyBtn = document.getElementById('freeOnlyBtn');
        const paidOnlyBtn = document.getElementById('paidOnlyBtn');
        
        if (freeOnlyBtn) {
            freeOnlyBtn.addEventListener('click', () => {
                this.filters.freeOnly = !this.filters.freeOnly;
                if (this.filters.freeOnly) {
                    this.filters.paidOnly = false;
                    this.updateFilterButton(paidOnlyBtn, false);
                }
                this.updateFilterButton(freeOnlyBtn, this.filters.freeOnly);
                this.currentPage = 1;
                this.applyFilters();
            });
        }
        
        if (paidOnlyBtn) {
            paidOnlyBtn.addEventListener('click', () => {
                this.filters.paidOnly = !this.filters.paidOnly;
                if (this.filters.paidOnly) {
                    this.filters.freeOnly = false;
                    this.updateFilterButton(freeOnlyBtn, false);
                }
                this.updateFilterButton(paidOnlyBtn, this.filters.paidOnly);
                this.currentPage = 1;
                this.applyFilters();
            });
        }
        
        // Sort options
        document.querySelectorAll('.sort-option').forEach(option => {
            option.addEventListener('click', () => {
                this.currentSort = option.dataset.value;
                this.currentPage = 1;
                this.applyFilters();
            });
        });
        
        // View size options
        document.querySelectorAll('.size-option').forEach(option => {
            option.addEventListener('click', () => {
                this.modsPerPage = parseInt(option.dataset.value);
                this.currentPage = 1;
                this.applyFilters();
            });
        });
        
        // View mode toggle
        const gridViewBtn = document.getElementById('gridViewBtn');
        const listViewBtn = document.getElementById('listViewBtn');
        
        if (gridViewBtn) {
            gridViewBtn.addEventListener('click', () => {
                this.viewMode = 'grid';
                this.renderMods();
            });
        }
        
        if (listViewBtn) {
            listViewBtn.addEventListener('click', () => {
                this.viewMode = 'list';
                this.renderMods();
            });
        }
    }
    
    updateFilterButton(button, isActive) {
        const checkbox = button.querySelector('div');
        if (isActive) {
            checkbox.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff0000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
            checkbox.classList.add('border-[#ff0000]');
            button.classList.add('border-[#ff0000]', 'text-white');
            button.classList.remove('text-[#999]');
        } else {
            checkbox.innerHTML = '';
            checkbox.classList.remove('border-[#ff0000]');
            button.classList.remove('border-[#ff0000]', 'text-white');
            button.classList.add('text-[#999]');
        }
    }
    
    setupSidebarToggles() {
        // Setup collapsible sections in sidebar
        document.querySelectorAll('.sidebar-toggle').forEach(toggleButton => {
            toggleButton.addEventListener('click', (e) => {
                e.stopPropagation();
                
                const parent = toggleButton.closest('div[class*="bg-[#111016]"]');
                if (!parent) return;
                
                const content = parent.querySelector('.sidebar-content');
                const arrow = toggleButton.querySelector('.collapse-arrow');
                
                if (!content) return;
                
                // Toggle content visibility
                if (content.classList.contains('hidden')) {
                    content.classList.remove('hidden');
                    arrow?.classList.add('rotate-180');
                } else {
                    content.classList.add('hidden');
                    arrow?.classList.remove('rotate-180');
                }
            });
        });
        
        // Setup category filters
        this.setupCategoryFilters();
    }
    
    setupCategoryFilters() {
        // Get all filter buttons from sidebar
        const filterButtons = document.querySelectorAll('aside button[class*="text-left"]');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const filterValue = button.textContent.trim().toLowerCase();
                const section = button.closest('div[class*="bg-[#111016]"]');
                
                if (!section) return;
                
                // Determine filter type based on section
                const sectionTitle = section.querySelector('button span[class*="font-semibold"]')?.textContent.trim().toLowerCase();
                
                let filterType = '';
                if (sectionTitle?.includes('categories')) filterType = 'categories';
                else if (sectionTitle?.includes('themes')) filterType = 'themes';
                else if (sectionTitle?.includes('features')) filterType = 'features';
                else if (sectionTitle?.includes('colors')) filterType = 'colors';
                else if (sectionTitle?.includes('champions')) filterType = 'champions';
                
                if (filterType && this.filters[filterType]) {
                    // Toggle filter
                    if (this.filters[filterType].has(filterValue)) {
                        this.filters[filterType].delete(filterValue);
                        button.classList.remove('bg-[#1A1823]', 'text-white');
                        button.classList.add('text-[#CACDD9]');
                    } else {
                        this.filters[filterType].add(filterValue);
                        button.classList.add('bg-[#1A1823]', 'text-white');
                        button.classList.remove('text-[#CACDD9]');
                    }
                    
                    this.currentPage = 1;
                    this.applyFilters();
                }
            });
        });
    }
    
    applyFilters() {
        let filtered = [...this.allMods];
        
        // Search filter
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(mod => 
                mod.title.toLowerCase().includes(query) ||
                mod.description.toLowerCase().includes(query) ||
                (mod.tags && mod.tags.some(tag => tag.toLowerCase().includes(query)))
            );
        }
        
        // Free/Paid filter
        if (this.filters.freeOnly) {
            filtered = filtered.filter(mod => mod.type === 'free' || mod.price === 0);
        }
        if (this.filters.paidOnly) {
            filtered = filtered.filter(mod => mod.type === 'premium' || mod.price > 0);
        }
        
        // Category filters
        if (this.filters.categories.size > 0) {
            filtered = filtered.filter(mod => {
                const category = mod.category?.toLowerCase() || '';
                return Array.from(this.filters.categories).some(filter => 
                    category.includes(filter.replace(' ', '-'))
                );
            });
        }
        
        // Theme filters
        if (this.filters.themes.size > 0) {
            filtered = filtered.filter(mod => {
                const tags = mod.tags?.map(t => t.toLowerCase()) || [];
                return Array.from(this.filters.themes).some(filter => 
                    tags.includes(filter)
                );
            });
        }
        
        // Features filters
        if (this.filters.features.size > 0) {
            filtered = filtered.filter(mod => {
                const tags = mod.tags?.map(t => t.toLowerCase()) || [];
                return Array.from(this.filters.features).some(filter => 
                    tags.includes(filter.replace(' ', '-'))
                );
            });
        }
        
        // Colors filters
        if (this.filters.colors.size > 0) {
            filtered = filtered.filter(mod => {
                const tags = mod.tags?.map(t => t.toLowerCase()) || [];
                return Array.from(this.filters.colors).some(filter => 
                    tags.includes(filter)
                );
            });
        }
        
        // Champions filter
        if (this.filters.champions.size > 0) {
            filtered = filtered.filter(mod => {
                const title = mod.title.toLowerCase();
                const tags = mod.tags?.map(t => t.toLowerCase()) || [];
                return Array.from(this.filters.champions).some(filter => 
                    title.includes(filter) || tags.includes(filter)
                );
            });
        }
        
        // Sort
        filtered = this.sortMods(filtered);
        
        this.filteredMods = filtered;
        this.renderMods();
        this.renderPagination();
    }
    
    sortMods(mods) {
        const sorted = [...mods];
        
        switch (this.currentSort) {
            case 'latest':
                sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'oldest':
                sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'most-viewed':
                sorted.sort((a, b) => (b.views || 0) - (a.views || 0));
                break;
            case 'most-downloaded':
                sorted.sort((a, b) => {
                    const aDownloads = parseInt((a.details?.downloads || '0').replace(/,/g, ''));
                    const bDownloads = parseInt((b.details?.downloads || '0').replace(/,/g, ''));
                    return bDownloads - aDownloads;
                });
                break;
            case 'name-az':
                sorted.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'name-za':
                sorted.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case 'price-low':
                sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
                break;
            case 'price-high':
                sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
                break;
        }
        
        return sorted;
    }
    
    renderMods() {
        const grid = document.getElementById('modsGrid');
        if (!grid) return;
        
        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.modsPerPage;
        const endIndex = startIndex + this.modsPerPage;
        const modsToShow = this.filteredMods.slice(startIndex, endIndex);
        
        if (modsToShow.length === 0) {
            grid.innerHTML = `
                <div class="col-span-full text-center py-16">
                    <p class="text-[#999] text-lg">No mods found matching your filters.</p>
                    <button onclick="window.modsPageManager.clearFilters()" class="mt-4 px-6 py-2 bg-[#ff0000] text-white rounded hover:bg-[#cc0000] transition-colors">
                        Clear Filters
                    </button>
                </div>
            `;
            return;
        }
        
        if (this.viewMode === 'grid') {
            grid.className = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-8';
            grid.innerHTML = modsToShow.map(mod => this.createModCard(mod)).join('');
        } else {
            grid.className = 'flex flex-col gap-4 mb-8';
            grid.innerHTML = modsToShow.map(mod => this.createModListItem(mod)).join('');
        }
    }
    
    createModCard(mod) {
        const category = mod.category?.replace('-', ' ') || 'Mod';
        const views = mod.views || Math.floor(Math.random() * 1000);
        const downloads = mod.details?.downloads || Math.floor(Math.random() * 500);
        const likes = Math.floor(Math.random() * 10);
        
        return `
            <div class="group relative w-full overflow-hidden cursor-pointer bg-[#0d0d0d] rounded border border-[#1c1c1c] hover:border-[#ff0000] transition-all duration-300">
                <div class="relative w-full overflow-hidden aspect-video">
                    <img src="${mod.image}" alt="${mod.title}" class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy">
                    <div class="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div class="px-2 py-1 text-xs font-bold bg-[#0d0d0d]/90 border border-[#ff0000]/60 text-[#ff0000] rounded flex items-center backdrop-blur-sm">
                            <span>${category}</span>
                        </div>
                    </div>
                </div>
                <div class="p-3">
                    <h3 class="text-white font-bold text-sm mb-1 truncate hover:text-[#ff0000] transition-colors">${mod.title}</h3>
                    <p class="text-[#999] text-xs mb-3 line-clamp-2">${mod.description}</p>
                    <div class="flex items-center justify-between text-xs text-[#999]">
                        <div class="flex items-center gap-3">
                            <div class="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                                <span>${views}</span>
                            </div>
                            <div class="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" x2="12" y1="15" y2="3"></line>
                                </svg>
                                <span>${downloads}</span>
                            </div>
                            <div class="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                                </svg>
                                <span>${likes}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    createModListItem(mod) {
        const category = mod.category?.replace('-', ' ') || 'Mod';
        const views = mod.views || Math.floor(Math.random() * 1000);
        const downloads = mod.details?.downloads || Math.floor(Math.random() * 500);
        
        return `
            <div class="flex gap-4 bg-[#0d0d0d] border border-[#1c1c1c] rounded p-4 hover:border-[#ff0000] transition-all duration-300 cursor-pointer">
                <div class="w-48 h-32 flex-shrink-0 overflow-hidden rounded">
                    <img src="${mod.image}" alt="${mod.title}" class="w-full h-full object-cover">
                </div>
                <div class="flex-1">
                    <div class="flex items-start justify-between mb-2">
                        <h3 class="text-white font-bold text-lg hover:text-[#ff0000] transition-colors">${mod.title}</h3>
                        <span class="px-3 py-1 text-xs font-bold bg-[#0d0d0d] border border-[#ff0000]/60 text-[#ff0000] rounded">${category}</span>
                    </div>
                    <p class="text-[#999] text-sm mb-4 line-clamp-2">${mod.description}</p>
                    <div class="flex items-center gap-6 text-sm text-[#999]">
                        <div class="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            <span>${views} views</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" x2="12" y1="15" y2="3"></line>
                            </svg>
                            <span>${downloads} downloads</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderPagination() {
        const container = document.getElementById('paginationContainer');
        if (!container) return;
        
        const totalPages = Math.ceil(this.filteredMods.length / this.modsPerPage);
        
        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }
        
        let html = `
            <button 
                ${this.currentPage === 1 ? 'disabled' : ''}
                class="w-8 h-8 flex items-center justify-center rounded ${this.currentPage === 1 ? 'bg-[#0d0d0d] text-[#333] cursor-not-allowed' : 'bg-[#0d0d0d] text-[#999] hover:text-white hover:border-[#ff0000] border border-[#1c1c1c]'}" 
                onclick="window.modsPageManager.goToPage(${this.currentPage - 1})"
                aria-label="Previous page"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M15 18l-6-6 6-6"></path>
                </svg>
            </button>
        `;
        
        // Page numbers
        const maxVisible = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);
        
        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            html += `
                <button 
                    class="w-8 h-8 flex items-center justify-center rounded font-bold ${i === this.currentPage ? 'bg-[#ff0000] text-white' : 'bg-[#0d0d0d] text-[#999] hover:text-white border border-[#1c1c1c] hover:border-[#ff0000]'}"
                    onclick="window.modsPageManager.goToPage(${i})"
                    aria-label="Page ${i}"
                >
                    ${i}
                </button>
            `;
        }
        
        if (endPage < totalPages) {
            html += `<span class="px-1 text-[#999]">...</span>`;
            html += `
                <button 
                    class="w-8 h-8 flex items-center justify-center rounded bg-[#0d0d0d] text-[#999] hover:text-white border border-[#1c1c1c] hover:border-[#ff0000]"
                    onclick="window.modsPageManager.goToPage(${totalPages})"
                    aria-label="Page ${totalPages}"
                >
                    ${totalPages}
                </button>
            `;
        }
        
        html += `
            <button 
                ${this.currentPage === totalPages ? 'disabled' : ''}
                class="w-8 h-8 flex items-center justify-center rounded ${this.currentPage === totalPages ? 'bg-[#0d0d0d] text-[#333] cursor-not-allowed' : 'bg-[#0d0d0d] text-[#999] hover:text-white hover:border-[#ff0000] border border-[#1c1c1c]'}" 
                onclick="window.modsPageManager.goToPage(${this.currentPage + 1})"
                aria-label="Next page"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 18l6-6-6-6"></path>
                </svg>
            </button>
        `;
        
        container.innerHTML = html;
    }
    
    goToPage(page) {
        const totalPages = Math.ceil(this.filteredMods.length / this.modsPerPage);
        if (page < 1 || page > totalPages) return;
        
        this.currentPage = page;
        this.renderMods();
        this.renderPagination();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    clearFilters() {
        this.filters = {
            categories: new Set(),
            themes: new Set(),
            features: new Set(),
            colors: new Set(),
            champions: new Set(),
            freeOnly: false,
            paidOnly: false
        };
        this.searchQuery = '';
        this.currentPage = 1;
        
        // Reset UI
        document.getElementById('searchInput').value = '';
        document.querySelectorAll('aside button[class*="bg-[#1A1823]"]').forEach(btn => {
            btn.classList.remove('bg-[#1A1823]', 'text-white');
            btn.classList.add('text-[#CACDD9]');
        });
        
        this.updateFilterButton(document.getElementById('freeOnlyBtn'), false);
        this.updateFilterButton(document.getElementById('paidOnlyBtn'), false);
        
        this.applyFilters();
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.modsPageManager = new ModsPageManager();
    });
} else {
    window.modsPageManager = new ModsPageManager();
}
