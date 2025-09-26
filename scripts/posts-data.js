// Posts Data System
console.log('Loading posts data...');

// Initialize posts data - with your posts as default
window.postsData = [
    {
        id: 1,
        title: "Chibi Lulu",
        description: "Cute chibi version of Lulu champion skin",
        category: "Champion Mod",
        type: "Premium",
        price: 10.00,
        currency: "PLN",
        tags: ["Lulu", "Chibi", "Skin"],
        image: "https://ddragon.leagueoflegends.com/cdn/15.19.1/img/champion/Lulu.png",
        author: "Admin",
        createdAt: "2025-09-26T08:00:00Z",
        updatedAt: "2025-09-26T08:00:00Z",
        content: "Adorable chibi-style Lulu skin modification."
    },
    {
        id: 2,
        title: "Cinnamoroll Kassadin",
        description: "Kawaii Cinnamoroll-themed Kassadin skin",
        category: "Champion Mod", 
        type: "Premium",
        price: 15,
        currency: "$",
        tags: ["Kassadin", "Cinnamoroll", "Kawaii"],
        image: "https://ddragon.leagueoflegends.com/cdn/15.19.1/img/champion/Kassadin.png",
        author: "Admin",
        createdAt: "2025-09-26T08:30:00Z",
        updatedAt: "2025-09-26T08:30:00Z",
        content: "Cute Cinnamoroll-themed skin for Kassadin with special effects."
    }
];

// Posts management functions
window.PostsManager = {
    nextId: 3, // Start from 3 after your 2 posts
    
    getAllPosts: function() {
        return window.postsData || [];
    },
    
    getPostById: function(id) {
        return window.postsData.find(post => post.id === parseInt(id));
    },
    
    addPost: function(postData) {
        const newPost = {
            id: this.nextId++,
            title: postData.title || 'Untitled Post',
            description: postData.description || '',
            category: postData.category || 'general',
            type: postData.type || 'free',
            tags: Array.isArray(postData.tags) ? postData.tags : [],
            image: postData.image || 'https://via.placeholder.com/300x200?text=No+Image',
            author: postData.author || 'Admin',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            content: postData.content || ''
        };
        
        // Add price and currency if it's a premium post
        if (postData.type === 'Premium' && postData.price) {
            newPost.price = parseFloat(postData.price);
            newPost.currency = postData.currency || 'PLN';
        }
        
        window.postsData.unshift(newPost); // Add to beginning
        this.saveToStorage();
        this.updateAllPages(); // Update all pages that display posts
        return newPost;
    },
    
    updatePost: function(id, postData) {
        const index = window.postsData.findIndex(post => post.id === parseInt(id));
        if (index !== -1) {
            window.postsData[index] = {
                ...window.postsData[index],
                ...postData,
                id: parseInt(id), // Ensure ID doesn't change
                updatedAt: new Date().toISOString()
            };
            
            // Add price and currency if it's a premium post
            if (postData.type === 'Premium' && postData.price) {
                window.postsData[index].price = parseFloat(postData.price);
                window.postsData[index].currency = postData.currency || 'PLN';
            }
            
            this.saveToStorage();
            this.updateAllPages(); // Update all pages that display posts
            return window.postsData[index];
        }
        return null;
    },
    
    deletePost: function(id) {
        const index = window.postsData.findIndex(post => post.id === parseInt(id));
        if (index !== -1) {
            const deleted = window.postsData.splice(index, 1)[0];
            this.saveToStorage();
            this.updateAllPages(); // Update all pages that display posts
            return deleted;
        }
        return null;
    },
    
    // New function to update all pages displaying posts
    updateAllPages: function() {
        console.log('🔄 Updating all pages with latest posts data...');
        
        // Trigger update events for main page components
        if (typeof window.displayItems === 'function') {
            window.displayItems();
            console.log('✅ Main page content updated');
        }
        
        // Update search results if search is active
        if (typeof window.handleSearch === 'function' && document.getElementById('championSearch')?.value) {
            window.handleSearch();
            console.log('✅ Search results updated');
        }
        
        // Update pagination
        if (typeof window.setupPagination === 'function') {
            window.setupPagination();
            console.log('✅ Pagination updated');
        }
        
        // Dispatch custom event for any other components listening
        window.dispatchEvent(new CustomEvent('postsUpdated', {
            detail: { posts: this.getAllPosts() }
        }));
        
        console.log('🎉 All pages updated with latest posts database!');
    },
    
    saveToStorage: function() {
        try {
            localStorage.setItem('heartbrokenskins_posts', JSON.stringify(window.postsData));
        } catch (e) {
            console.warn('Could not save posts to localStorage:', e);
        }
    },
    
    loadFromStorage: function() {
        try {
            const saved = localStorage.getItem('heartbrokenskins_posts');
            console.log('🔍 Checking localStorage for posts...');
            
            if (saved) {
                console.log('📦 Found saved data in localStorage');
                const parsedPosts = JSON.parse(saved);
                console.log('📊 Parsed posts:', parsedPosts.length, 'posts');
                
                if (Array.isArray(parsedPosts)) {
                    window.postsData = parsedPosts;
                    // Update nextId to be higher than any existing ID
                    if (parsedPosts.length > 0) {
                        const maxId = Math.max(...parsedPosts.map(p => p.id));
                        this.nextId = maxId + 1;
                    }
                    console.log('✅ Successfully loaded posts from localStorage:', parsedPosts.length, 'posts');
                    console.log('📋 Post titles:', parsedPosts.map(p => p.title));
                    return true; // Successfully loaded from storage
                }
            } else {
                console.log('🔍 No saved data found in localStorage');
            }
        } catch (e) {
            console.error('❌ Could not load posts from localStorage:', e);
        }
        return false; // No data in storage, use defaults
    },
    
    searchPosts: function(searchTerm) {
        if (!searchTerm) return this.getAllPosts();
        
        const term = searchTerm.toLowerCase();
        return window.postsData.filter(post => 
            post.title.toLowerCase().includes(term) ||
            post.description.toLowerCase().includes(term) ||
            post.tags.some(tag => tag.toLowerCase().includes(term)) ||
            post.content.toLowerCase().includes(term)
        );
    }
};

// Load saved posts on initialization
const loadedFromStorage = window.PostsManager.loadFromStorage();

// Only use sample data if no saved posts exist
if (!loadedFromStorage) {
    console.log('No saved posts found, using default data');
    window.PostsManager.saveToStorage(); // Save default data to storage
}

console.log('Posts data loaded:', window.postsData.length, 'posts');

// Trigger posts manager if it exists
if (window.postsContentManager) {
    window.postsContentManager.dataLoaded();
}