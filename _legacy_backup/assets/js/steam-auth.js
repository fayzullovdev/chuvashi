// Real Steam Authentication using Steam OpenID
// Note: This requires a backend server to handle the OpenID callback

// Use shared currentUser from auth.js
let currentUser = window.currentUser || null;

// Load user from localStorage
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
        // Update profile button if updateProfileButton exists
        if (typeof updateProfileButton === 'function') {
            updateProfileButton();
        }
    } else {
        localStorage.removeItem('steamUser');
        window.currentUser = null;
    }
}

// Steam OpenID Configuration
const BACKEND_URL = (window.location.protocol === 'file:' || window.location.origin === 'null')
    ? 'http://localhost:3000'
    : window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
        ? 'http://localhost:3000'
        : window.location.origin; // Assume backend is same origin in production or correctly configured cors

// Authenticate with Steam
function authenticateWithSteam() {
    // Redirect to backend auth endpoint
    const loginURL = `${BACKEND_URL}/auth/steam`;

    // Show loading message
    if (typeof showNotification === 'function') {
        showNotification('Steam ga yo\'naltirilmoqda...', 'info');
    }

    // Redirect to Backend
    window.location.href = loginURL;
}

// Check for Steam callback in URL (handled by backend redirecting back with ?steamid=...)
async function checkSteamCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const steamId = urlParams.get('steamid');
    const error = urlParams.get('error');

    if (error) {
        if (typeof showNotification === 'function') {
            showNotification('Steam autentifikatsiya xatosi: ' + error, 'error');
        }
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
    }

    if (steamId) {
        // Backend has processed OpenID and returned Steam ID
        await fetchSteamUserDataFromBackend(steamId);

        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

// Fetch user data from Backend
async function fetchSteamUserDataFromBackend(steamId) {
    if (typeof showNotification === 'function') {
        showNotification('Steam ma\'lumotlari yuklanmoqda...', 'info');
    }

    try {
        const response = await fetch(`${BACKEND_URL}/api/user/${steamId}`);
        if (!response.ok) {
            throw new Error('Backend serverdan ma\'lumot olib bo\'lmadi');
        }

        const userData = await response.json();

        // Standardize user object
        const steamUser = {
            steamId: userData.steamId,
            username: userData.username || `Steam User ${userData.steamId.slice(-4)}`,
            avatar: userData.avatar || 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
            profileUrl: userData.profileUrl,
            loggedIn: true,
            stats: userData.stats // Stats are now handled by backend
        };

        // Save to localStorage
        currentUser = steamUser;
        window.currentUser = currentUser;
        saveUserState();

        if (typeof updateProfileButton === 'function') {
            updateProfileButton();
        }

        // Redirect to profile or stay
        if (typeof showNotification === 'function') {
            showNotification('Muvaffaqiyatli kirildi!', 'success');
        }

        setTimeout(() => {
            // Optional: redirect to profile if not already there
            // window.location.href = 'profile.html'; 
        }, 1000);

    } catch (error) {
        console.error('Steam ma\'lumotlarini olishda xatolik:', error);
        if (typeof showNotification === 'function') {
            showNotification('Ma\'lumotlarni yuklashda xatolik: ' + error.message, 'error');
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadUserState();
    checkSteamCallback();
});

// Export functions
window.authenticateWithSteam = authenticateWithSteam;
window.currentUser = currentUser;


