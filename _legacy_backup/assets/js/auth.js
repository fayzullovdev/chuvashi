// Steam Authentication System

// User state management (shared with steam-auth.js)
window.currentUser = window.currentUser || null;
let currentUser = window.currentUser;

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', () => {
    loadUserState();
    updateProfileButton();
});

// Load user from localStorage (in real app, this would be from server)
function loadUserState() {
    const savedUser = localStorage.getItem('steamUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        window.currentUser = currentUser;
    }
}

// Save user to localStorage
function saveUserState() {
    if (currentUser) {
        localStorage.setItem('steamUser', JSON.stringify(currentUser));
        window.currentUser = currentUser;
    } else {
        localStorage.removeItem('steamUser');
        window.currentUser = null;
    }
}

// Steam OpenID authentication
function loginWithSteam() {
    // Use real Steam authentication
    if (typeof authenticateWithSteam === 'function') {
        authenticateWithSteam();
    } else {
        // Fallback: directly redirect to Steam OpenID
        const STEAM_OPENID_URL = 'https://steamcommunity.com/openid/login';
        const RETURN_URL = window.location.origin + '/auth/steam/callback';
        const BACKEND_URL = window.location.origin;
        
        const params = new URLSearchParams({
            'openid.ns': 'http://specs.openid.net/auth/2.0',
            'openid.mode': 'checkid_setup',
            'openid.return_to': RETURN_URL,
            'openid.realm': BACKEND_URL,
            'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
            'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select'
        });
        
        const loginURL = `${STEAM_OPENID_URL}?${params.toString()}`;
        
        // Show loading message
        if (typeof showNotification === 'function') {
            showNotification('Steam ga yo\'naltirilmoqda...', 'info');
        }
        
        // Redirect to Steam
        window.location.href = loginURL;
    }
}

function registerWithSteam() {
    // Registration is same as login for Steam
    loginWithSteam();
}

function logout() {
    currentUser = null;
    saveUserState();
    updateProfileButton();
    showNotification('Tizimdan chiqildi', 'info');
}

// Update profile button in header
function updateProfileButton() {
    const profileLinks = document.querySelectorAll('.profile-link, .auth-button');
    
    profileLinks.forEach(link => {
        if (currentUser && currentUser.loggedIn) {
            // Show profile
            link.innerHTML = `
                <div class="profile-dropdown">
                    <img src="${currentUser.avatar}" alt="Profile" class="profile-avatar">
                    <span class="profile-username">${currentUser.username}</span>
                    <div class="profile-menu">
                        <a href="profile.html" class="profile-menu-item">
                            <span>Mening Profilim</span>
                        </a>
                        <a href="${currentUser.profileUrl}" target="_blank" class="profile-menu-item">
                            <span>Steam Profil</span>
                        </a>
                        <a href="#" class="profile-menu-item" onclick="logout(); return false;">
                            <span>Chiqish</span>
                        </a>
                    </div>
                </div>
            `;
            link.classList.add('profile-logged-in');
            link.classList.remove('auth-button');
        } else {
            // Show login/register button
            link.innerHTML = `
                <button class="btn-steam-auth" onclick="openSteamAuth()">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    Steam orqali kirish
                </button>
            `;
            link.classList.add('auth-button');
            link.classList.remove('profile-logged-in');
        }
    });
}

// Open Steam authentication modal
function openSteamAuth() {
    const modal = document.getElementById('steamAuthModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeSteamAuth() {
    const modal = document.getElementById('steamAuthModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Make functions globally available
window.loginWithSteam = loginWithSteam;
window.registerWithSteam = registerWithSteam;
window.logout = logout;
window.openSteamAuth = openSteamAuth;
window.closeSteamAuth = closeSteamAuth;

