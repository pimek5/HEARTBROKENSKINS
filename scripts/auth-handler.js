// Authentication Handler
const API_URL = 'https://heartbrokenskins-logging.up.railway.app';

// Check if user is authenticated and update UI
async function initAuth() {
    const token = localStorage.getItem('authToken');
    
    console.log('Auth check - token:', token ? 'present' : 'missing');
    
    if (!token) return;

    try {
        console.log('Fetching user data from API...');
        const response = await fetch(`${API_URL}/api/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('API response status:', response.status);

        if (response.ok) {
            const data = await response.json();
            console.log('User data received:', data.user);
            displayUserProfile(data.user);
        } else {
            // Token invalid
            console.warn('Token invalid, removing...');
            localStorage.removeItem('authToken');
        }
    } catch (error) {
        console.error('Auth check error:', error);
    }
}

// Display user profile in header
function displayUserProfile(user) {
    const loginBtn = document.getElementById('loginBtn');
    const userProfile = document.getElementById('userProfile');
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const logoutBtn = document.getElementById('logoutBtn');

    console.log('Displaying user profile:', user);
    console.log('Elements found:', {
        loginBtn: !!loginBtn,
        userProfile: !!userProfile,
        userAvatar: !!userAvatar,
        userName: !!userName,
        logoutBtn: !!logoutBtn
    });

    if (!loginBtn || !userProfile) {
        console.error('Required elements not found!');
        return;
    }

    // Hide login button, show profile
    loginBtn.style.display = 'none';
    userProfile.style.display = 'flex';
    userProfile.style.cursor = 'pointer';

    // Set user data
    userAvatar.src = user.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png';
    userName.textContent = user.displayName || user.username;

    console.log('Profile displayed successfully');

    // Create dropdown menu if it doesn't exist
    let dropdown = document.getElementById('profileDropdown');
    if (!dropdown) {
        dropdown = createProfileDropdown(user);
        userProfile.parentElement.style.position = 'relative';
        userProfile.parentElement.appendChild(dropdown);
    }

    // Toggle dropdown on profile click (only add once)
    if (!userProfile.hasAttribute('data-dropdown-added')) {
        userProfile.setAttribute('data-dropdown-added', 'true');
        userProfile.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            dropdown.style.display = 'none';
        });
    }

    // Logout handler (only add once)
    if (!logoutBtn.hasAttribute('data-handler-added')) {
        logoutBtn.setAttribute('data-handler-added', 'true');
        logoutBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            handleLogout();
        });
    }
}

// Create profile dropdown menu
function createProfileDropdown(user) {
    const dropdown = document.createElement('div');
    dropdown.id = 'profileDropdown';
    dropdown.style.cssText = `
        display: none;
        position: absolute;
        top: 100%;
        right: 0;
        margin-top: 0.5rem;
        background: #111016;
        border: 1px solid #25222F;
        border-radius: 5px;
        width: 260px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        z-index: 1000;
    `;

    const onlineStatus = user.isAdmin ? '#8a2be2' : '#39DD52'; // Purple for admin, green for regular
    
    dropdown.innerHTML = `
        <div style="background: #25222F; border-radius: 3px; margin: 12px; height: 110px; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; overflow: hidden;">
            <div style="position: absolute; inset: 0; background: #25222F; opacity: 0.6;"></div>
            <div style="position: relative; z-index: 10; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                <div style="position: relative; margin-bottom: 8px;">
                    <div style="width: 64px; height: 64px; border-radius: 50%; overflow: hidden; border: 1px solid rgba(255,255,255,0.2);">
                        <img src="${user.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}" alt="${user.displayName}'s profile" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div style="position: absolute; bottom: 0; right: 0; width: 12px; height: 12px; background: ${onlineStatus}; border: 1.5px solid #25222F; border-radius: 50%;"></div>
                </div>
                <div style="color: #CACDD9; font-weight: bold; text-align: center; font-size: 12px; line-height: 18px;">${user.displayName || user.username}</div>
            </div>
        </div>
        <div style="padding: 0 12px;">
            <a href="dashboard.html" style="display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; color: #CACDD9; text-decoration: none; transition: background 0.2s; border-radius: 4px; margin-bottom: 12px;" onmouseover="this.style.background='rgba(37,34,47,0.3)'" onmouseout="this.style.background='transparent'">
                <div style="display: flex; align-items: center; gap: 16px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <span style="font-size: 12px; font-weight: 500;">Settings</span>
                </div>
            </a>
            <a href="activity.html" style="display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; color: #CACDD9; text-decoration: none; transition: background 0.2s; border-radius: 4px; margin-bottom: 12px;" onmouseover="this.style.background='rgba(37,34,47,0.3)'" onmouseout="this.style.background='transparent'">
                <div style="display: flex; align-items: center; gap: 16px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path>
                    </svg>
                    <span style="font-size: 12px; font-weight: 500;">Activity</span>
                </div>
            </a>
            <div style="border-top: 0.5px solid #25222F; margin: 12px; margin-left: 0; margin-right: 0;"></div>
            <a href="creator-panel.html" style="display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; color: #CACDD9; text-decoration: none; transition: background 0.2s; border-radius: 4px; margin-bottom: 12px;" onmouseover="this.style.background='rgba(37,34,47,0.3)'" onmouseout="this.style.background='transparent'">
                <div style="display: flex; align-items: center; gap: 16px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle>
                        <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle>
                        <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>
                        <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle>
                        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
                    </svg>
                    <span style="font-size: 12px; font-weight: 500;">Creator Panel</span>
                </div>
            </a>
            <a href="order-history.html" style="display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; color: #CACDD9; text-decoration: none; transition: background 0.2s; border-radius: 4px; margin-bottom: 12px;" onmouseover="this.style.background='rgba(37,34,47,0.3)'" onmouseout="this.style.background='transparent'">
                <div style="display: flex; align-items: center; gap: 16px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                        <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                        <path d="M10 9H8"></path>
                        <path d="M16 13H8"></path>
                        <path d="M16 17H8"></path>
                    </svg>
                    <span style="font-size: 12px; font-weight: 500;">Order History</span>
                </div>
            </a>
            <div style="border-top: 0.5px solid #25222F; margin: 12px; margin-left: 0; margin-right: 0;"></div>
            <button onclick="localStorage.removeItem('authToken'); window.location.href='home.html';" style="width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; color: #F44949; background: transparent; border: none; cursor: pointer; transition: background 0.2s; border-radius: 4px; margin-bottom: 12px;" onmouseover="this.style.background='rgba(244,73,73,0.1)'" onmouseout="this.style.background='transparent'">
                <div style="display: flex; align-items: center; gap: 16px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" x2="9" y1="12" y2="12"></line>
                    </svg>
                    <span style="font-size: 12px; font-weight: 500;">Logout</span>
                </div>
            </button>
        </div>
    `;

    return dropdown;
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('authToken');
    window.location.reload();
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
} else {
    initAuth();
}
