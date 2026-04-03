// Admin Authentication Handler
const API_URL = 'https://heartbrokenskins-logging.up.railway.app';

// Check admin access on page load
async function checkAdminAccess() {
    const token = localStorage.getItem('authToken');
    const loginForm = document.getElementById('loginForm');
    const adminPanel = document.querySelector('.admin-panel');
    
    console.log('🔐 Checking admin access...');
    
    if (!token) {
        console.log('❌ No auth token found');
        showAccessDenied('Please login first');
        return;
    }

    try {
        // First check if user is logged in
        console.log('📡 Verifying user token...');
        const userResponse = await fetch(`${API_URL}/api/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!userResponse.ok) {
            console.log('❌ Token invalid');
            localStorage.removeItem('authToken');
            showAccessDenied('Invalid or expired session. Please login again.');
            return;
        }

        const userData = await userResponse.json();
        console.log('✅ User authenticated:', userData.user.username);
        console.log('🔑 Is admin:', userData.user.isAdmin);

        // Update header with user profile
        updateUserProfile(userData.user);

        // Check if user is admin
        if (!userData.user.isAdmin) {
            console.log('❌ User is not admin');
            showAccessDenied('Access Denied. Admin privileges required.');
            return;
        }

        // User is admin - show admin panel
        console.log('✅ Admin access granted!');
        showAdminPanel();

    } catch (error) {
        console.error('❌ Admin check error:', error);
        showAccessDenied('Error checking admin access. Please try again.');
    }
}

// Show access denied message
function showAccessDenied(message) {
    const loginForm = document.getElementById('loginForm');
    const adminPanel = document.querySelector('.admin-panel');
    
    if (loginForm) loginForm.style.display = 'none';
    if (adminPanel) adminPanel.style.display = 'none';

    // Create access denied message
    const deniedDiv = document.createElement('div');
    deniedDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, rgba(255, 0, 0, 0.1) 0%, rgba(139, 0, 0, 0.1) 100%);
        border: 2px solid rgba(255, 0, 0, 0.3);
        border-radius: 15px;
        padding: 3rem;
        text-align: center;
        max-width: 500px;
        z-index: 9999;
    `;
    
    deniedDiv.innerHTML = `
        <div style="font-size: 4rem; margin-bottom: 1rem;">🚫</div>
        <h2 style="color: #ff0000; font-size: 2rem; margin-bottom: 1rem;">Access Denied</h2>
        <p style="color: rgba(255, 255, 255, 0.8); margin-bottom: 2rem;">${message}</p>
        <a href="home.html" style="
            display: inline-block;
            padding: 0.75rem 2rem;
            background: linear-gradient(135deg, #ff0000 0%, #cc0000 100%);
            color: #fff;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            transition: all 0.3s ease;
        ">Back to Home</a>
    `;
    
    document.body.appendChild(deniedDiv);
}

// Show admin panel
function showAdminPanel() {
    const loginForm = document.getElementById('loginForm');
    const adminPanel = document.querySelector('.admin-panel');
    
    if (loginForm) loginForm.style.display = 'none';
    if (adminPanel) adminPanel.style.display = 'block';
    
    console.log('✅ Admin panel displayed');
}

// Update user profile in header
function updateUserProfile(user) {
    const loginBtn = document.getElementById('loginBtn');
    const userProfile = document.getElementById('userProfile');
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const logoutBtn = document.getElementById('logoutBtn');

    if (!loginBtn || !userProfile) return;

    loginBtn.style.display = 'none';
    userProfile.style.display = 'flex';

    userAvatar.src = user.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png';
    userName.textContent = user.displayName || user.username;

    if (!logoutBtn.hasAttribute('data-handler-added')) {
        logoutBtn.setAttribute('data-handler-added', 'true');
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('authToken');
            window.location.href = 'home.html';
        });
    }
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAdminAccess);
} else {
    checkAdminAccess();
}
