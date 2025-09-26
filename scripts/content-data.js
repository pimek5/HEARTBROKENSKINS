// Content Data Manager - uses actual posts from posts-data.js
class ContentDataManager {
    constructor() {
        this.posts = [];
        this.isReady = false;
    }

    async initialize() {
        // Wait for PostsManager to be ready
        if (window.PostsManager && window.PostsManager.isInitialized()) {
            this.posts = window.PostsManager.getAllPosts();
            this.isReady = true;
            console.log('ContentDataManager: Loaded', this.posts.length, 'posts');
        } else {
            // Listen for posts ready event
            document.addEventListener('postsReady', () => {
                this.posts = window.PostsManager.getAllPosts();
                this.isReady = true;
                console.log('ContentDataManager: Loaded', this.posts.length, 'posts via event');
                // Dispatch content ready event
                document.dispatchEvent(new CustomEvent('contentReady'));
            });
        }
    }

    getAllPosts() {
        return this.posts;
    }

    getPostsByCategory(category) {
        return this.posts.filter(post => post.category === category);
    }

    getPostsByType(type) {
        return this.posts.filter(post => post.type === type);
    }

    getPostsByTag(tag) {
        return this.posts.filter(post => 
            post.tags && post.tags.some(postTag => 
                postTag.toLowerCase().includes(tag.toLowerCase())
            )
        );
    }

    searchPosts(query) {
        const searchTerm = query.toLowerCase();
        return this.posts.filter(post => 
            post.title.toLowerCase().includes(searchTerm) ||
            post.description.toLowerCase().includes(searchTerm) ||
            (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
        );
    }
}

// Initialize Content Data Manager
const contentDataManager = new ContentDataManager();

// Fallback champion data for when no posts exist
const fallbackChampionData = [
    {
        id: 1,
        title: "Aatrox",
        description: "The Darkin Blade - A legendary warrior fallen to darkness.",
        category: "champion-mod",
        type: "free",
        tags: ["darkin", "warrior", "sword", "top"],
        image: "https://via.placeholder.com/300x200?text=Aatrox",
        downloadUrl: "#",
        details: {
            creator: "Riot Games",
            version: "15.19.1",
            compatibility: "All Versions",
            fileSize: "2.1 MB",
            downloads: "12,431",
            rating: "4.9/5"
        }
    },
    {
        id: 2,
        title: "Ahri",
        description: "The Nine-Tailed Fox - A magical vastayan seeking her true nature.",
        category: "champion-mod",
        type: "free", 
        tags: ["vastayan", "magic", "fox", "mid"],
        image: "https://via.placeholder.com/300x200?text=Ahri",
        downloadUrl: "#",
        details: {
            creator: "Riot Games",
            version: "15.19.1",
            compatibility: "All Versions",
            fileSize: "2.3 MB",
            downloads: "18,921",
            rating: "4.8/5"
        }
    },
    {
        id: 3,
        title: "Akali", 
        description: "The Rogue Assassin - A deadly ninja who strikes from the shadows.",
        category: "champion-mod",
        type: "premium",
        tags: ["ninja", "assassin", "shadows", "mid"],
        image: "https://via.placeholder.com/300x200?text=Akali",
        downloadUrl: "#",
        details: {
            creator: "Riot Games",
            version: "15.19.1",
            compatibility: "All Versions",
            fileSize: "2.5 MB",
            downloads: "15,672",
            rating: "4.7/5"
        }
    }
];

// Main content data function - uses posts when available, fallback to champions
function getContentData() {
    if (contentDataManager.isReady && contentDataManager.posts.length > 0) {
        return contentDataManager.getAllPosts();
    }
    return fallbackChampionData;
}

// Champion Tags Helper Functions for content filtering
function getAvailableChampions() {
    return fallbackChampionData;
}

function toggleChampionDropdown() {
    const dropdown = document.getElementById('championDropdown');
    if (!dropdown) return;
    
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
    if (!tagList) return;
    
    const champions = getAvailableChampions();
    tagList.innerHTML = champions.map(champion => `
        <div class="champion-tag-option" onclick="addChampionTag('${champion.title}')">
            <img src="${champion.image}" alt="${champion.title}" 
                 onerror="this.src='https://via.placeholder.com/24x24?text=⚔️'">
            <span>${champion.title}</span>
        </div>
    `).join('');
}

function filterChampionTags(searchTerm) {
    const tagList = document.getElementById('championTagList');
    if (!tagList) return;
    
    const champions = getAvailableChampions();
    const filteredChampions = champions.filter(champion => 
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
    const searchInput = document.querySelector('#sidebarFilters input[placeholder*="Search"]');
    if (!searchInput) return;
    
    // Add champion name to search
    searchInput.value = championName;
    
    // Trigger search
    if (window.filterItems) {
        window.filterItems();
    }
    
    // Close dropdown
    const dropdown = document.getElementById('championDropdown');
    if (dropdown) {
        dropdown.style.display = 'none';
    }
    
    console.log(`Searching for: ${championName}`);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    contentDataManager.initialize();
});

// Export for use in other scripts
window.contentData = getContentData();
window.getContentData = getContentData;
window.contentDataManager = contentDataManager;