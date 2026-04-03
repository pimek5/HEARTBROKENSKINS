// Discord data management with real-time fetching capabilities
// This file handles Discord server statistics and updates

class DiscordDataManager {
    constructor() {
        this.data = {
            serverName: "𝐇𝐄𝐗𝐑𝐓𝐁𝐑𝐗𝐄𝐍 𝐂𝐇𝐑𝐎𝐌𝐀𝐒",
            serverId: "1153027935553454191",
            inviteCode: "hexrtbrxenchromas",
            memberCount: 3812,
            onlineMembers: 791,
            totalChannels: 8,
            textChannels: 5,
            voiceChannels: 3,
            boostLevel: 2,
            boostCount: 14,
            lastUpdated: new Date().toISOString(),
            ownerId: "318104006385729538",
            serverIcon: "a_b71a953066903ae6f6312e80b6f32f6e",
            features: ["COMMUNITY", "NEWS", "BANNER", "ANIMATED_ICON"],
            dataSource: "api",
            isRealTime: true,
            fetchAttempts: 0,
            maxFetchAttempts: 3
        };
        
        this.updateCallbacks = [];
        this.isInitialized = false;
        
        // Auto-initialize
        this.initialize();
    }
    
    // Initialize the Discord data manager
    async initialize() {
        console.log('🎮 Initializing Discord Data Manager...');
        
        // Try to fetch fresh data
        await this.fetchDiscordData();
        
        // Set up periodic updates every 2 minutes
        setInterval(() => {
            this.fetchDiscordData();
        }, 2 * 60 * 1000);
        
        this.isInitialized = true;
        console.log('✅ Discord Data Manager initialized');
    }
    
    // Fetch Discord server data from API
    async fetchDiscordData() {
        try {
            this.data.fetchAttempts++;
            
            console.log(`📡 Fetching Discord data (attempt ${this.data.fetchAttempts})...`);
            
            // Priority 1: Try Widget API first (more reliable for live data)
            try {
                const widgetResponse = await fetch(`https://discord.com/api/guilds/${this.data.serverId}/widget.json`);
                
                if (widgetResponse.ok) {
                    const widgetData = await widgetResponse.json();
                    
                    if (widgetData.presence_count || widgetData.members?.length) {
                        const oldMemberCount = this.data.memberCount;
                        const oldOnlineCount = this.data.onlineMembers;
                        
                        // Widget API provides better online count and member list
                        this.data.onlineMembers = widgetData.presence_count || widgetData.members?.length || this.data.onlineMembers;
                        this.data.serverName = widgetData.name || this.data.serverName;
                        
                        // For total member count, use a combination approach:
                        // If widget has many members, estimate total based on online ratio
                        if (widgetData.members?.length >= 50) {
                            // Use widget member count as base, but this is usually limited to 100
                            const visibleMembers = widgetData.members.length;
                            const onlineMembers = this.data.onlineMembers;
                            
                            // Estimate total members based on online/offline ratio (typical Discord servers have 15-25% online)
                            const estimatedTotal = Math.round(onlineMembers / 0.2); // Assuming 20% online
                            this.data.memberCount = Math.max(estimatedTotal, this.data.memberCount);
                        }
                        
                        this.data.lastUpdated = new Date().toISOString();
                        this.data.dataSource = "discord-widget-api";
                        this.data.fetchAttempts = 0; // Reset on success
                        
                        console.log(`✅ Discord data updated via Widget API: ${this.data.memberCount} members, ${this.data.onlineMembers} online`);
                        
                        // Notify callbacks if data changed
                        if (oldMemberCount !== this.data.memberCount || oldOnlineCount !== this.data.onlineMembers) {
                            this.notifyCallbacks();
                        }
                        
                        return; // Success, exit function
                    }
                }
            } catch (e) {
                console.log(`Widget API failed: ${e.message}`);
            }
            
            // Priority 2: Try Invite API as fallback
            const inviteResponse = await fetch(`https://discord.com/api/v10/invites/${this.data.inviteCode}?with_counts=true&with_expiration=false`);
            
            if (inviteResponse.ok) {
                const inviteData = await inviteResponse.json();
                
                // Invite API sometimes provides member counts
                if (inviteData.guild) {
                    const oldMemberCount = this.data.memberCount;
                    const oldOnlineCount = this.data.onlineMembers;
                    
                    // Only update if we get valid numbers
                    if (inviteData.guild.approximate_member_count > 0) {
                        this.data.memberCount = inviteData.guild.approximate_member_count;
                    }
                    if (inviteData.guild.approximate_presence_count > 0) {
                        this.data.onlineMembers = inviteData.guild.approximate_presence_count;
                    }
                    
                    this.data.serverName = inviteData.guild.name || this.data.serverName;
                    this.data.serverIcon = inviteData.guild.icon || this.data.serverIcon;
                    this.data.features = inviteData.guild.features || this.data.features;
                    this.data.lastUpdated = new Date().toISOString();
                    this.data.dataSource = "discord-invite-api";
                    this.data.fetchAttempts = 0; // Reset on success
                    
                    console.log(`✅ Discord data updated via Invite API: ${this.data.memberCount} members, ${this.data.onlineMembers} online`);
                    
                    // Notify callbacks if data changed
                    if (oldMemberCount !== this.data.memberCount || oldOnlineCount !== this.data.onlineMembers) {
                        this.notifyCallbacks();
                    }
                    
                    return; // Success, exit function
                }
            }
            
            throw new Error('All Discord APIs returned invalid data');
            
        } catch (error) {
            console.warn(`⚠️ Failed to fetch Discord data (attempt ${this.data.fetchAttempts}):`, error.message);
            
            // If we've exceeded max attempts, mark as fallback
            if (this.data.fetchAttempts >= this.data.maxFetchAttempts) {
                this.data.dataSource = "fallback";
                this.data.isRealTime = false;
                console.log('⚠️ Using fallback Discord data after multiple failed attempts');
            }
        }
    }
    
    // Get current Discord data
    getData() {
        return { ...this.data };
    }
    
    // Register callback for data updates
    onUpdate(callback) {
        if (typeof callback === 'function') {
            this.updateCallbacks.push(callback);
        }
    }
    
    // Notify all registered callbacks
    notifyCallbacks() {
        this.updateCallbacks.forEach(callback => {
            try {
                callback(this.getData());
            } catch (error) {
                console.warn('Error in Discord data callback:', error);
            }
        });
    }
    
    // Update specific DOM elements with Discord data
    updateDOMElements() {
        // Update member count elements
        const memberCountElements = document.querySelectorAll('#discord-member-count, .discord-member-count');
        memberCountElements.forEach(element => {
            element.textContent = `${this.data.memberCount} members`;
        });
        
        // Update online count elements
        const onlineCountElements = document.querySelectorAll('#discord-online-count, .discord-online-count');
        onlineCountElements.forEach(element => {
            element.textContent = `${this.data.onlineMembers} online`;
        });
        
        // Update server name elements
        const serverNameElements = document.querySelectorAll('.discord-server-name');
        serverNameElements.forEach(element => {
            element.textContent = this.data.serverName;
        });
        
        // Update status indicators
        const statusElements = document.querySelectorAll('.discord-status');
        statusElements.forEach(element => {
            element.classList.toggle('real-time', this.data.isRealTime);
            element.classList.toggle('fallback', !this.data.isRealTime);
        });
        
        console.log('� Discord DOM elements updated');
    }
    
    // Manual refresh function
    async refresh() {
        console.log('🔄 Manual Discord data refresh requested');
        await this.fetchDiscordData();
        this.updateDOMElements();
    }
}

// Create global instance
window.discordDataManager = new DiscordDataManager();

// Backward compatibility - expose data directly
Object.defineProperty(window, 'discordData', {
    get() {
        return window.discordDataManager.getData();
    }
});

// Auto-update DOM when data changes
window.discordDataManager.onUpdate((data) => {
    window.discordDataManager.updateDOMElements();
});

// Update DOM elements once page is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            window.discordDataManager.updateDOMElements();
        }, 1000);
    });
} else {
    setTimeout(() => {
        window.discordDataManager.updateDOMElements();
    }, 1000);
}

console.log('📊 Discord Data Manager loaded successfully');