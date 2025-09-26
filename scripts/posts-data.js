// Posts Data System
console.log('Loading posts data...');

// Posts Data System with GitHub persistence
console.log('Loading posts data system...');

// GitHub configuration
const GITHUB_CONFIG = {
    owner: 'pimek5',
    repo: 'HEARTBROKENSKINS',
    branch: 'main',
    file: 'posts-database.json'
};

// Initialize posts data - will be loaded from GitHub
window.postsData = [];

// Posts management functions with GitHub persistence
window.PostsManager = {
    nextId: 1,
    isLoading: false,
    
    // Load posts from GitHub
    async loadFromGitHub() {
        this.isLoading = true;
        console.log('📡 Loading posts from GitHub...');
        
        try {
            const response = await fetch(`https://raw.githubusercontent.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.branch}/${GITHUB_CONFIG.file}?v=${Date.now()}`);
            
            if (response.ok) {
                const data = await response.json();
                console.log('📦 GitHub data loaded:', data);
                
                if (data.posts && Array.isArray(data.posts)) {
                    // If GitHub has posts, use them
                    if (data.posts.length > 0) {
                        window.postsData = data.posts;
                        this.nextId = data.nextId || (Math.max(...data.posts.map(p => p.id)) + 1);
                        
                        console.log('✅ Successfully loaded posts from GitHub:', window.postsData.length, 'posts');
                        console.log('📋 Next ID will be:', this.nextId);
                        
                        // Also save to localStorage as backup
                        this.saveToStorage();
                        this.isLoading = false;
                        return true;
                    } else {
                        // GitHub has empty posts array, check localStorage for existing posts
                        console.log('📱 GitHub has empty posts, checking localStorage...');
                        const localSuccess = this.loadFromStorage();
                        if (localSuccess && window.postsData.length > 0) {
                            console.log('✅ Found posts in localStorage, using local data');
                            this.isLoading = false;
                            return true;
                        } else {
                            console.log('📋 No posts in localStorage either, starting fresh');
                            window.postsData = [];
                            this.nextId = 1;
                            this.isLoading = false;
                            return true;
                        }
                    }
                }
            } else {
                console.log('⚠️ GitHub file not found or not accessible, using fallback');
            }
        } catch (error) {
            console.error('❌ Failed to load from GitHub:', error);
        }
        
        // Fallback to localStorage if GitHub fails
        console.log('📱 Falling back to localStorage...');
        const localSuccess = this.loadFromStorage();
        this.isLoading = false;
        return localSuccess;
    },
    
    // Save posts to GitHub using repository dispatch
    async saveToGitHub() {
        console.log('💾 Saving posts to GitHub...');
        
        // Save to localStorage as backup first
        this.saveToStorage();
        
        // Create the data structure for GitHub
        const githubData = {
            posts: window.postsData,
            nextId: this.nextId,
            lastUpdated: new Date().toISOString(),
            version: "1.0"
        };
        
        console.log('📄 Data prepared for GitHub:', githubData);
        console.log('📊 Saving', githubData.posts.length, 'posts to database');
        
        // For frontend security, we'll display instructions instead of direct API calls
        // This prevents exposing GitHub tokens in the frontend
        if (githubData.posts.length > 0) {
            console.log('🔗 Posts data ready for GitHub database:');
            console.log('� Copy this JSON and replace the content of posts-database.json:');
            console.log('```json');
            console.log(JSON.stringify(githubData, null, 2));
            console.log('```');
            
            // Show user notification about manual step
            if (window.showNotification) {
                window.showNotification('📋 Posts saved to localStorage! Check console for GitHub database update instructions.', 'info');
            }
        }
        
        return true;
    },
    
    getAllPosts: function() {
        return window.postsData || [];
    },
    
    getPostById: function(id) {
        return window.postsData.find(post => post.id === parseInt(id));
    },
    
    addPost: async function(postData) {
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
        await this.saveToGitHub(); // Save to GitHub (persistent)
        this.updateAllPages(); // Update all pages that display posts
        console.log('✅ Post added:', newPost.title);
        return newPost;
    },
    
    updatePost: async function(id, postData) {
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
            
            await this.saveToGitHub(); // Save to GitHub (persistent)
            this.updateAllPages(); // Update all pages that display posts
            console.log('✅ Post updated:', window.postsData[index].title);
            return window.postsData[index];
        }
        return null;
    },
    
    deletePost: async function(id) {
        const index = window.postsData.findIndex(post => post.id === parseInt(id));
        if (index !== -1) {
            const deleted = window.postsData.splice(index, 1)[0];
            await this.saveToGitHub(); // Save to GitHub (persistent)
            this.updateAllPages(); // Update all pages that display posts
            console.log('🗑️ Post deleted:', deleted.title);
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

// Initialize the posts system - load from GitHub first, fallback to localStorage
async function initializePostsSystem() {
    console.log('🚀 Initializing posts system...');
    
    try {
        // Try to load from GitHub first (persistent storage)
        const githubSuccess = await window.PostsManager.loadFromGitHub();
        
        if (githubSuccess) {
            console.log('✅ Posts loaded from GitHub successfully');
        } else {
            console.log('⚠️ No GitHub data found, starting with empty posts list');
        }
        
        console.log('📊 Posts system initialized with', window.postsData.length, 'posts');
        
        // Trigger posts manager if it exists
        if (window.postsContentManager) {
            window.postsContentManager.dataLoaded();
        }
        
        // Trigger main page update if displayItems function exists
        if (typeof window.displayItems === 'function') {
            console.log('🔄 Triggering main page content update with posts');
            window.displayItems();
        }
        
        // Fire custom event for posts ready
        const postsReadyEvent = new CustomEvent('postsReady', {
            detail: { postsCount: window.postsData.length }
        });
        document.dispatchEvent(postsReadyEvent);
        
        return true;
    } catch (error) {
        console.error('❌ Failed to initialize posts system:', error);
        return false;
    }
}

// Start the initialization process
initializePostsSystem();