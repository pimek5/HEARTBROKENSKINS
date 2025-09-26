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
            creator: "TechDesigner",
            version: "1.0.0",
            compatibility: "Premium Edition Only",
            fileSize: "22.1 MB",
            downloads: "1,156",
            rating: "4.9/5"
        }
    },
    {
        id: 4,
        title: "Enchanted Forest Map",
        description: "A magical forest environment with glowing trees and mystical creatures.",
        category: "environment",
        type: "premium",
        size: "large",
        tags: ["forest", "magical", "environment", "glowing"],
        image: "placeholder-4.jpg",
        downloadUrl: "#",
        details: {
            creator: "EnviroArtist",
            version: "1.1.0",
            compatibility: "Game Version 2.0+",
            fileSize: "45.8 MB",
            downloads: "3,274",
            rating: "4.7/5"
        }
    },
    {
        id: 5,
        title: "Stealth Assassin Outfit",
        description: "Dark ninja outfit with shadow effects and silent movement enhancement.",
        category: "character",
        type: "free",
        size: "medium",
        tags: ["ninja", "stealth", "dark", "shadow"],
        image: "placeholder-5.jpg",
        downloadUrl: "#",
        details: {
            creator: "ShadowMaker",
            version: "1.3.2",
            compatibility: "All Versions",
            fileSize: "12.4 MB",
            downloads: "7,823",
            rating: "4.5/5"
        }
    },
    {
        id: 6,
        title: "Lightning Bow",
        description: "Electrified bow that shoots lightning arrows with chain damage.",
        category: "weapon",
        type: "premium",
        size: "small",
        tags: ["bow", "lightning", "electric", "chain"],
        image: "placeholder-6.jpg",
        downloadUrl: "#",
        details: {
            creator: "StormCrafter",
            version: "2.1.0",
            compatibility: "Game Version 1.8+",
            fileSize: "6.2 MB",
            downloads: "4,567",
            rating: "4.8/5"
        }
    },
    {
        id: 7,
        title: "Battle Mage Armor",
        description: "Elegant battle mage armor with glowing runes and mystical energy effects.",
        category: "character",
        type: "premium",
        size: "large",
        tags: ["mage", "armor", "mystical", "runes"],
        image: "placeholder-7.jpg",
        downloadUrl: "#",
        details: {
            creator: "MagicCrafter",
            version: "1.5.0",
            compatibility: "Game Version 2.0+",
            fileSize: "18.9 MB",
            downloads: "3,456",
            rating: "4.9/5"
        }
    },
    {
        id: 8,
        title: "Crystal Blade",
        description: "Translucent crystal sword that glows with inner light and frost effects.",
        category: "weapon",
        type: "limited",
        size: "medium",
        tags: ["crystal", "sword", "frost", "glow"],
        image: "placeholder-8.jpg",
        downloadUrl: "#",
        details: {
            creator: "CrystalForge",
            version: "1.0.0",
            compatibility: "Premium Edition Only",
            fileSize: "11.2 MB",
            downloads: "987",
            rating: "5.0/5"
        }
    },
    {
        id: 9,
        title: "Shadow Assassin Cloak",
        description: "Dark flowing cloak with smoke effects and stealth enhancement visuals.",
        category: "character",
        type: "free",
        size: "medium",
        tags: ["assassin", "cloak", "shadow", "stealth"],
        image: "placeholder-9.jpg",
        downloadUrl: "#",
        details: {
            creator: "DarkDesign",
            version: "2.1.0",
            compatibility: "All Versions",
            fileSize: "9.8 MB",
            downloads: "8,234",
            rating: "4.4/5"
        }
    },
    {
        id: 10,
        title: "Royal Guardian Outfit",
        description: "Noble guardian armor with golden accents and royal emblems.",
        category: "character",
        type: "premium",
        size: "large",
        tags: ["royal", "guardian", "gold", "noble"],
        image: "placeholder-10.jpg",
        downloadUrl: "#",
        details: {
            creator: "RoyalArt",
            version: "1.3.0",
            compatibility: "Game Version 2.1+",
            fileSize: "21.4 MB",
            downloads: "2,876",
            rating: "4.7/5"
        }
    },
    {
        id: 11,
        title: "Flame Whip",
        description: "Burning whip weapon with fire particle effects and ember trails.",
        category: "weapon",
        type: "premium",
        size: "small",
        tags: ["whip", "fire", "flames", "embers"],
        image: "placeholder-11.jpg",
        downloadUrl: "#",
        details: {
            creator: "FireWeapons",
            version: "1.8.0",
            compatibility: "Game Version 1.9+",
            fileSize: "7.3 MB",
            downloads: "4,123",
            rating: "4.6/5"
        }
    },
    {
        id: 12,
        title: "Cyber Punk Outfit",
        description: "Futuristic cyberpunk clothing with neon highlights and tech accessories.",
        category: "character",
        type: "limited",
        size: "medium",
        tags: ["cyberpunk", "neon", "tech", "futuristic"],
        image: "placeholder-12.jpg",
        downloadUrl: "#",
        details: {
            creator: "CyberStyle",
            version: "1.0.2",
            compatibility: "Premium Edition Only",
            fileSize: "16.7 MB",
            downloads: "1,543",
            rating: "4.8/5"
        }
    },
    {
        id: 13,
        title: "Ice Palace Environment",
        description: "Frozen palace environment with ice sculptures and aurora effects.",
        category: "environment",
        type: "premium",
        size: "large",
        tags: ["ice", "palace", "frozen", "aurora"],
        image: "placeholder-13.jpg",
        downloadUrl: "#",
        details: {
            creator: "FrozenWorlds",
            version: "2.0.0",
            compatibility: "Game Version 2.0+",
            fileSize: "52.1 MB",
            downloads: "1,987",
            rating: "4.9/5"
        }
    },
    {
        id: 14,
        title: "Storm Hammer",
        description: "Massive war hammer crackling with lightning and thunder effects.",
        category: "weapon",
        type: "free",
        size: "large",
        tags: ["hammer", "lightning", "storm", "thunder"],
        image: "placeholder-14.jpg",
        downloadUrl: "#",
        details: {
            creator: "StormForge",
            version: "1.4.0",
            compatibility: "All Versions",
            fileSize: "13.5 MB",
            downloads: "6,789",
            rating: "4.5/5"
        }
    },
    {
        id: 15,
        title: "Desert Nomad Gear",
        description: "Traditional desert nomad outfit with flowing robes and tribal accessories.",
        category: "character",
        type: "free",
        size: "medium",
        tags: ["desert", "nomad", "tribal", "robes"],
        image: "placeholder-15.jpg",
        downloadUrl: "#",
        details: {
            creator: "DesertCraft",
            version: "1.6.0",
            compatibility: "All Versions",
            fileSize: "14.2 MB",
            downloads: "5,432",
            rating: "4.3/5"
        }
    },
    {
        id: 16,
        title: "Void Walker Armor",
        description: "Dark purple armor that seems to bend light with void energy effects.",
        category: "character",
        type: "limited",
        size: "large",
        tags: ["void", "dark", "purple", "energy"],
        image: "placeholder-16.jpg",
        downloadUrl: "#",
        details: {
            creator: "VoidCrafter",
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