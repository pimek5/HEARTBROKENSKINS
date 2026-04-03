// Test the updated Discord Data Manager
const fetch = require('node-fetch');

// Mock the Discord Data Manager for testing
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
    
    getData() {
        return { ...this.data };
    }
}

async function testDiscordDataManager() {
    console.log('🧪 Testing updated Discord Data Manager...\n');
    
    const manager = new DiscordDataManager();
    
    console.log('Before fetch:', {
        members: manager.data.memberCount,
        online: manager.data.onlineMembers,
        source: manager.data.dataSource
    });
    
    await manager.fetchDiscordData();
    
    console.log('\nAfter fetch:', {
        members: manager.data.memberCount,
        online: manager.data.onlineMembers,
        source: manager.data.dataSource,
        isRealTime: manager.data.isRealTime
    });
    
    console.log('\n🏁 Test complete!');
}

testDiscordDataManager();