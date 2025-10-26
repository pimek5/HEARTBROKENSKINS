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

    // Set user data
    userAvatar.src = user.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png';
    userName.textContent = user.displayName || user.username;

    console.log('Profile displayed successfully');

    // Logout handler (only add once)
    if (!logoutBtn.hasAttribute('data-handler-added')) {
        logoutBtn.setAttribute('data-handler-added', 'true');
        logoutBtn.addEventListener('click', handleLogout);
    }
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
