#!/usr/bin/env node
// Discord API Test Script
// Run with: node test-discord-api.js

async function testDiscordAPI() {
    console.log('🎮 Testing Discord API endpoints...\n');
    
    const inviteCode = 'hexrtbrxenchromas';
    const serverId = '1153027935553454191';
    
    // Test 1: Discord Invite API
    console.log('📡 Testing Discord Invite API...');
    try {
        const response = await fetch(`https://discord.com/api/v10/invites/${inviteCode}?with_counts=true&with_expiration=false`);
        console.log(`Status: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Success!');
            console.log(`Server: ${data.guild?.name || 'N/A'}`);
            console.log(`Members: ${data.guild?.approximate_member_count || 'N/A'}`);
            console.log(`Online: ${data.guild?.approximate_presence_count || 'N/A'}`);
            console.log(`Icon: ${data.guild?.icon || 'N/A'}`);
            console.log('');
        } else {
            console.log('❌ Failed');
            const errorText = await response.text();
            console.log('Error:', errorText.substring(0, 200));
            console.log('');
        }
    } catch (error) {
        console.log('❌ Error:', error.message);
        console.log('');
    }
    
    // Test 2: Alternative Discord Invite API
    console.log('📡 Testing Alternative Discord Invite API...');
    try {
        const response = await fetch(`https://discordapp.com/api/invites/${inviteCode}?with_counts=true`);
        console.log(`Status: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Success!');
            console.log(`Server: ${data.guild?.name || 'N/A'}`);
            console.log(`Members: ${data.guild?.approximate_member_count || 'N/A'}`);
            console.log(`Online: ${data.guild?.approximate_presence_count || 'N/A'}`);
            console.log('');
        } else {
            console.log('❌ Failed');
            const errorText = await response.text();
            console.log('Error:', errorText.substring(0, 200));
            console.log('');
        }
    } catch (error) {
        console.log('❌ Error:', error.message);
        console.log('');
    }
    
    // Test 3: Discord Widget API
    console.log('📡 Testing Discord Widget API...');
    try {
        const response = await fetch(`https://discord.com/api/guilds/${serverId}/widget.json`);
        console.log(`Status: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Success!');
            console.log(`Server: ${data.name || 'N/A'}`);
            console.log(`Online: ${data.presence_count || data.members?.length || 'N/A'}`);
            console.log(`Channels: ${data.channels?.length || 'N/A'}`);
            console.log(`Members in widget: ${data.members?.length || 'N/A'}`);
            console.log('');
        } else {
            console.log('❌ Failed');
            const errorText = await response.text();
            console.log('Error:', errorText.substring(0, 200));
            console.log('');
        }
    } catch (error) {
        console.log('❌ Error:', error.message);
        console.log('');
    }
    
    // Test 4: CORS Headers check
    console.log('🔍 Testing CORS headers...');
    try {
        const response = await fetch(`https://discord.com/api/v10/invites/${inviteCode}?with_counts=true`, {
            method: 'HEAD'
        });
        console.log(`CORS preflight status: ${response.status}`);
        console.log('Headers:');
        for (const [key, value] of response.headers.entries()) {
            if (key.toLowerCase().includes('cors') || key.toLowerCase().includes('access-control')) {
                console.log(`  ${key}: ${value}`);
            }
        }
        console.log('');
    } catch (error) {
        console.log('❌ CORS test error:', error.message);
        console.log('');
    }
    
    console.log('🏁 Discord API testing complete!');
}

// For browser environment
if (typeof window !== 'undefined') {
    window.testDiscordAPI = testDiscordAPI;
    console.log('Discord API tester loaded. Run testDiscordAPI() in console.');
} else {
    // For Node.js environment
    testDiscordAPI();
}