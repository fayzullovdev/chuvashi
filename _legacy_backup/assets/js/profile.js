// Profile Page Logic

let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    loadUserState();
    renderProfile();
});

function loadUserState() {
    const savedUser = localStorage.getItem('steamUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        window.currentUser = currentUser;
    } else if (window.currentUser) {
        currentUser = window.currentUser;
    }
}

function renderProfile() {
    if (!currentUser || !currentUser.loggedIn) {
        // Show not logged in message
        document.getElementById('notLoggedIn').style.display = 'block';
        document.querySelector('.profile-header').style.display = 'none';
        document.querySelector('.stats-section').style.display = 'none';
        return;
    }

    // Hide not logged in message
    document.getElementById('notLoggedIn').style.display = 'none';
    document.querySelector('.profile-header').style.display = 'flex';
    document.querySelector('.stats-section').style.display = 'block';

    // Update profile header
    const avatar = document.getElementById('profileAvatar');
    const username = document.getElementById('profileUsername');
    const steamId = document.getElementById('profileSteamId');
    const steamLink = document.getElementById('profileSteamLink');

    if (avatar) avatar.src = currentUser.avatar || '';
    if (username) username.textContent = currentUser.username || 'Noma\'lum';
    if (steamId) steamId.textContent = `Steam ID: ${currentUser.steamId || 'Noma\'lum'}`;
    if (steamLink) steamLink.href = currentUser.profileUrl || '#';

    // Update statistics
    const stats = currentUser.stats || getDefaultStats();
    
    updateStat('statKD', stats.kd || '0.00');
    updateStat('statKills', formatNumber(stats.kills || 0));
    updateStat('statDeaths', formatNumber(stats.deaths || 0));
    updateStat('statAssists', formatNumber(stats.assists || 0));
    updateStat('statHeadshots', formatNumber(stats.headshots || 0));
    updateStat('statHSPercent', (stats.headshotPercentage || '0.0') + '%');
    updateStat('statMatches', formatNumber(stats.matches || 0));
    updateStat('statWinRate', (stats.winRate || '0.0') + '%');

    // Animate stats
    animateStats();
}

function updateStat(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
    }
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function getDefaultStats() {
    return {
        kills: 0,
        deaths: 0,
        assists: 0,
        headshots: 0,
        matches: 0,
        wins: 0,
        kd: '0.00',
        headshotPercentage: '0.0',
        winRate: '0.0'
    };
}

function animateStats() {
    const statCards = document.querySelectorAll('.stat-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    statCards.forEach(card => {
        card.classList.add('hidden');
        observer.observe(card);
    });
}

// Listen for auth updates
window.addEventListener('storage', (e) => {
    if (e.key === 'steamUser') {
        loadUserState();
        renderProfile();
    }
});

// Also check on focus (in case user logged in another tab)
window.addEventListener('focus', () => {
    loadUserState();
    renderProfile();
});

