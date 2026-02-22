// F-Gaming Full-Stack Application Logic (Enhanced)

const API_BASE = window.location.origin;

// Correct usage enforcement: If not on port 8000 (Flask), redirect to Flask.
if (window.location.hostname === 'localhost' && window.location.port !== '8000') {
    window.location.href = 'http://localhost:8000' + window.location.pathname;
}


// --- State ---
let currentUser = null;
const SUPPORTED_LANGS = ['en', 'ru'];
const LANG_STORAGE_KEY = 'site_lang';
let currentLang = localStorage.getItem(LANG_STORAGE_KEY) || 'en';
if (!SUPPORTED_LANGS.includes(currentLang)) currentLang = 'en';

const I18N = {
    en: {
        'nav.home': 'Home',
        'nav.store': 'Store',
        'nav.forum': 'Forum',
        'nav.servers': 'Servers',
        'nav.ruler': 'Ruler',
        'nav.bans': 'Bans',
        'nav.admin': 'Admin',
        'auth.login': 'Login',
        'auth.steam': 'Steam',
        'notice.login_first': 'Please log in first.',
        'notice.purchase_success': 'Purchase successful!',
        'notice.fill_fields': 'Please fill in all fields.',
        'notice.error': 'Something went wrong.',
        'notice.refresh_error': 'Error',
        'notice.ip_copied': 'IP copied to clipboard!',
        'rules.project': 'PROJECT RULES',
        'rules.back': 'Back',
        'rules.search': 'Search by number, title, text, or penalty...',
        'rules.empty': 'No rules found for this search.'
    },
    ru: {
        'nav.home': '\u0413\u043b\u0430\u0432\u043d\u0430\u044f',
        'nav.store': '\u041c\u0430\u0433\u0430\u0437\u0438\u043d',
        'nav.forum': '\u0424\u043e\u0440\u0443\u043c',
        'nav.servers': '\u0421\u0435\u0440\u0432\u0435\u0440\u044b',
        'nav.ruler': '\u041f\u0440\u0430\u0432\u0438\u043b\u0430',
        'nav.bans': '\u0411\u0430\u043d\u044b',
        'nav.admin': '\u0410\u0434\u043c\u0438\u043d',
        'auth.login': '\u0412\u043e\u0439\u0442\u0438',
        'auth.steam': 'Steam',
        'notice.login_first': '\u0421\u043d\u0430\u0447\u0430\u043b\u0430 \u0432\u043e\u0439\u0434\u0438\u0442\u0435 \u0432 \u0430\u043a\u043a\u0430\u0443\u043d\u0442.',
        'notice.purchase_success': '\u041f\u043e\u043a\u0443\u043f\u043a\u0430 \u0432\u044b\u043f\u043e\u043b\u043d\u0435\u043d\u0430!',
        'notice.fill_fields': '\u0417\u0430\u043f\u043e\u043b\u043d\u0438\u0442\u0435 \u0432\u0441\u0435 \u043f\u043e\u043b\u044f.',
        'notice.error': '\u041f\u0440\u043e\u0438\u0437\u043e\u0448\u043b\u0430 \u043e\u0448\u0438\u0431\u043a\u0430.',
        'notice.refresh_error': '\u041e\u0448\u0438\u0431\u043a\u0430',
        'notice.ip_copied': 'IP \u0441\u043a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u043d \u0432 \u0431\u0443\u0444\u0435\u0440 \u043e\u0431\u043c\u0435\u043d\u0430!',
        'rules.project': '\u041f\u0420\u0410\u0412\u0418\u041b\u0410 \u041f\u0420\u041e\u0415\u041a\u0422\u0410',
        'rules.back': '\u041d\u0430\u0437\u0430\u0434',
        'rules.search': '\u041f\u043e\u0438\u0441\u043a \u043f\u043e \u043d\u043e\u043c\u0435\u0440\u0443, \u043d\u0430\u0437\u0432\u0430\u043d\u0438\u044e, \u0442\u0435\u043a\u0441\u0442\u0443 \u0438\u043b\u0438 \u043d\u0430\u043a\u0430\u0437\u0430\u043d\u0438\u044e...',
        'rules.empty': '\u041f\u043e \u0432\u0430\u0448\u0435\u043c\u0443 \u0437\u0430\u043f\u0440\u043e\u0441\u0443 \u043d\u0438\u0447\u0435\u0433\u043e \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u043e.'
    }
};

function t(key, fallback = '') {
    return (I18N[currentLang] && I18N[currentLang][key]) || fallback || key;
}

function applyTranslations(root = document) {
    root.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.getAttribute('data-i18n');
        if (!key) return;
        el.textContent = t(key, el.textContent);
    });
    root.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (!key) return;
        el.setAttribute('placeholder', t(key, el.getAttribute('placeholder') || ''));
    });
}

function getLangSwitcherHtml() {
    const enActive = currentLang === 'en' ? 'background:rgba(0,242,234,0.18);border-color:var(--primary);color:#fff;' : '';
    const ruActive = currentLang === 'ru' ? 'background:rgba(0,242,234,0.18);border-color:var(--primary);color:#fff;' : '';
    return `
        <div class="lang-switch" style="display:flex; gap:6px; margin-right:10px;">
            <button onclick="setLanguage('en')" class="btn btn-glass" style="padding:6px 10px; font-size:0.75rem; ${enActive}">EN</button>
            <button onclick="setLanguage('ru')" class="btn btn-glass" style="padding:6px 10px; font-size:0.75rem; ${ruActive}">RU</button>
        </div>
    `;
}

function setLanguage(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) return;
    currentLang = lang;
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    updateUI();
    applyTranslations();
    if (typeof window.refreshRulesLocale === 'function') window.refreshRulesLocale();
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', async () => {
    document.documentElement.lang = currentLang;
    // Initial check for session
    try {
        const res = await fetch(`${API_BASE}/api/user/me`);
        if (res.ok) {
            currentUser = await res.json();
            console.log('Session restored:', currentUser.username);
        } else {
            console.log('No active session.');
            currentUser = null;
        }
    } catch (e) {
        console.error('Session check failed:', e);
    }

    // Ensure initial data exists
    await fetch(`${API_BASE}/api/init`).catch(() => { });

    updateUI();

    const path = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);

    // Auth guard for protected paths (Frontend fallback)
    const protectedPaths = ['/shop', '/profile', '/forum', '/admin', '/bans'];
    if (!currentUser && protectedPaths.some(p => path.includes(p))) {
        window.location.href = '/?next=' + encodeURIComponent(path);
        return;
    }

    // If redirected to index with 'next' param, or if we just want to force login
    if (!currentUser && (path === '/' || path === '/index.html') && urlParams.has('next')) {
        showLoginModal();
    }

    if (path === '/' || path.includes('index')) {
        renderNews();
        initChat();
    }

    if (path.includes('shop')) renderShop();
    if (path.includes('profile')) renderProfile();
    if (path.includes('forum')) { renderForum(); renderNews(); }
    if (path.includes('admin')) renderAdmin();
    if (path.includes('bans')) renderBans();
    if (path.includes('servers')) renderServers();

    if (urlParams.get('verified') === 'true') {
        showNotification('Your email has been verified successfully!', 'success');
        if (currentUser) currentUser.email_verified = true;
        updateUI();
    }

    // Global Chat Init if logged in
    if (currentUser && document.getElementById('chat-widget')) initChat();

    applyTranslations();
    if (typeof window.refreshRulesLocale === 'function') window.refreshRulesLocale();
});


// --- UI Logic ---
function updateUI() {
    const navActions = document.querySelector('.nav-actions');
    const navLinks = document.querySelectorAll('.nav-link');

    // Email verification banner removed as per user request
    const banner = document.getElementById('verification-banner');
    if (banner) banner.remove();

    if (navLinks) {
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href !== '/' && !currentUser) {
                link.classList.add('nav-link-disabled');
                link.onclick = (e) => {
                    e.preventDefault();
                    showLoginModal();
                    showNotification(t('notice.login_first', 'Please log in first.'), 'info');
                };
            } else {
                link.classList.remove('nav-link-disabled');
                link.onclick = null;
            }
        });
    }

    if (!navActions) return;

    if (currentUser) {
        navActions.innerHTML = `
            ${getLangSwitcherHtml()}
            ${currentUser.role === 'admin' ? '<a href="/admin" class="btn btn-glass" style="border-color:var(--secondary); color:var(--secondary); padding: 6px 10px; margin-right: 10px;"><i class="fas fa-hammer"></i></a>' : ''}
            <div class="user-menu" onclick="window.location.href=\'/profile\'">
                <img src="${currentUser.avatar || 'https://via.placeholder.com/32'}" class="user-avatar-small">
                <span style="font-weight:600; font-size: 0.9rem;">${currentUser.username}</span>
                <small class="role-badge ${currentUser.role}">${currentUser.role}</small>
                <div style="display: flex; align-items:center; gap: 5px; margin-left: 10px;">
                    <span style="color:#ffd700; font-weight:800; font-size: 1.1rem;">${currentUser.dcoins}</span>
                    <img src="/static/assets/img/coin.png" style="width:0.9rem; vertical-align:middle; margin-left:5px;">
                </div>
            </div>
            <button onclick="logout()" class="btn btn-glass" style="margin-left: 10px; background: rgba(255,255,255,0.05); padding: 8px 12px;"><i class="fas fa-power-off"></i></button>
        `;
    } else {
        navActions.innerHTML = `
            ${getLangSwitcherHtml()}
            <button onclick="showLoginModal()" class="btn btn-glass">${t('auth.login', 'Login')}</button>
            <button onclick="loginWithSteam()" class="btn btn-primary"><i class="fab fa-steam"></i> ${t('auth.steam', 'Steam')}</button>
        `;
    }

    applyTranslations();
}

async function purchaseItem(id) {
    if (!currentUser) {
        showNotification('Authorization required.', 'error');
        showLoginModal();
        return;
    }
    const res = await fetch(`${API_BASE}/api/shop/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_id: id })
    });
    const data = await res.json();
    if (res.ok) {
        currentUser.dcoins = data.new_balance;
        currentUser.role = data.new_role || currentUser.role;
        currentUser.rank = data.new_rank || currentUser.rank;
        updateUI();
        showNotification(data.msg || t('notice.purchase_success', 'Purchase successful!'), 'success');
    } else {
        showNotification(data.error || 'Purchase failed.', 'error');
    }
}

// --- Auth flows ---
function showLoginModal() {
    const modalHtml = `
        <div id="auth-modal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); display:flex; align-items:center; justify-content:center; z-index:9999; backdrop-filter:blur(8px)">
            <div class="card" style="width:380px; padding:2.5rem; border:1px solid var(--primary-dim); position:relative; background:var(--bg-dark)">
                <button onclick="this.closest(\'#auth-modal\').remove()" style="position:absolute; top:20px; right:20px; color:var(--text-muted); border:none; background:none; cursor:pointer; font-size:1.2rem;"><i class="fas fa-times"></i></button>
                <h2 id="auth-title" style="text-align:center; margin-bottom:2rem; letter-spacing:1px;">ACCESS <span>PORTAL</span></h2>
                
                <div id="login-form" style="display:flex; flex-direction:column; gap:1.2rem">
                    <input type="text" id="login-user" placeholder="Username" style="padding:14px; border-radius:10px; border:1px solid var(--glass-border); background:rgba(255,255,255,0.03); color:#fff; outline:none">
                    <input type="password" id="login-pass" placeholder="Password" style="padding:14px; border-radius:10px; border:1px solid var(--glass-border); background:rgba(255,255,255,0.03); color:#fff; outline:none">
                    <button onclick="attemptLogin()" class="btn btn-primary" style="padding:14px; font-weight:800; text-transform:uppercase; letter-spacing:1px;">Initialize Link</button>
                    <p style="text-align:center; font-size:0.9rem; color:var(--text-muted)">Don't have an account? <a href="javascript:void(0)" onclick="toggleAuthForm(\'register\')" style="color:var(--primary)">Sign up</a></p>
                    <div style="display:flex; align-items:center; gap:10px; opacity:0.3; margin:0.5rem 0;"><hr style="flex:1;"><small>OR</small><hr style="flex:1;"></div>
                    <button onclick="loginWithSteam()" class="btn btn-glass" style="width:100%"><i class="fab fa-steam"></i> Login with Steam</button>
                </div>

                <div id="register-form" style="display:none; flex-direction:column; gap:1.2rem">
                    <input type="text" id="reg-user" placeholder="Username" style="padding:14px; border-radius:10px; border:1px solid var(--glass-border); background:rgba(255,255,255,0.03); color:#fff; outline:none">
                    <input type="email" id="reg-email" placeholder="Email (Gmail)" style="padding:14px; border-radius:10px; border:1px solid var(--glass-border); background:rgba(255,255,255,0.03); color:#fff; outline:none">
                    <input type="password" id="reg-pass" placeholder="Password" style="padding:14px; border-radius:10px; border:1px solid var(--glass-border); background:rgba(255,255,255,0.03); color:#fff; outline:none">
                    <button onclick="attemptRegister()" class="btn btn-primary" style="padding:14px; font-weight:800; text-transform:uppercase; letter-spacing:1px;">Create Account</button>
                    <p style="text-align:center; font-size:0.9rem; color:var(--text-muted)">Already have an account? <a href="javascript:void(0)" onclick="toggleAuthForm(\'login\')" style="color:var(--primary)">Log in</a></p>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = document.getElementById('auth-modal');
    if (modal) applyTranslations(modal);
}

function toggleAuthForm(type) {
    const login = document.getElementById('login-form');
    const register = document.getElementById('register-form');
    const title = document.getElementById('auth-title');
    if (type === 'register') {
        login.style.display = 'none';
        register.style.display = 'flex';
        title.innerHTML = 'CREATE <span>ACCOUNT</span>';
    } else {
        login.style.display = 'flex';
        register.style.display = 'none';
        title.innerHTML = 'ACCESS <span>PORTAL</span>';
    }
}

async function attemptRegister() {
    const username = document.getElementById('reg-user').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-pass').value;

    if (!username || !email || !password) {
        showNotification(t('notice.fill_fields', 'Please fill in all fields.'), 'error');
        return;
    }

    const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
    });
    const data = await res.json();
    if (res.ok) {
        showNotification(data.msg, 'success');
        document.getElementById('auth-modal').remove();
        setTimeout(() => window.location.reload(), 2000);
    } else {
        showNotification(data.error || t('notice.error', 'Something went wrong.'), 'error');
    }
}

async function attemptLogin() {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: document.getElementById('login-user').value,
            password: document.getElementById('login-pass').value
        })
    });
    const data = await res.json();
    if (res.ok) {
        currentUser = data.user;
        updateUI();
        document.getElementById('auth-modal').remove();
        showNotification(`Welcome back, ${currentUser.username}!`, 'success');
        setTimeout(() => window.location.reload(), 800);
    } else {
        showNotification(data.error || 'Login failed', 'error');
    }
}

async function logout() {
    await fetch(`${API_BASE}/api/auth/logout`);
    currentUser = null;
    window.location.href = '/';
}

function loginWithSteam() {
    showNotification('Establishing Steam Link...', 'info');
    const callbackUrl = `${window.location.origin}/api/auth/steam/callback`;
    const params = new URLSearchParams({
        'openid.ns': 'http://specs.openid.net/auth/2.0',
        'openid.mode': 'checkid_setup',
        'openid.return_to': callbackUrl,
        'openid.realm': window.location.origin,
        'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
        'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select'
    });
    window.location.href = `https://steamcommunity.com/openid/login?${params.toString()}`;
}

// --- Admin Controls ---
async function adminRemoveVIP(username) {
    const res = await fetch(`${API_BASE}/api/admin/remove-vip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
    });
    if (res.ok) {
        showNotification(`VIP rank removed from ${username}`, 'success');
        renderAdmin();
    }
}

async function adminAddDCoin(username) {
    const res = await fetch(`${API_BASE}/api/admin/add-dcoins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, amount: 100 })
    });
    if (res.ok) {
        showNotification(`+100 dcoin given to ${username}`, 'success');
        renderAdmin();
    }
}

async function adminClearGlow(username) {
    const res = await fetch(`${API_BASE}/api/admin/clear-glow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
    });
    if (res.ok) renderAdmin();
}

async function adminToggleBan(username, isBanned) {
    const res = await fetch(`${API_BASE}/api/admin/toggle-ban`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
    });
    if (res.ok) { renderAdmin(); showNotification('Status updated.', 'success'); }
}

// --- Rendering ---
let currentCategory = 'privileges';

async function setCategory(cat) {
    currentCategory = cat.toLowerCase();
    document.querySelectorAll('.filter-btn').forEach(btn => {
        const btnText = btn.textContent.toLowerCase();
        if (btnText === currentCategory) {
            btn.classList.add('btn-primary');
            btn.classList.remove('btn-glass');
        } else {
            btn.classList.add('btn-glass');
            btn.classList.remove('btn-primary');
        }
    });
    renderShop();
}

async function renderShop() {
    const grid = document.getElementById('shop-grid');
    if (!grid) return;
    const res = await fetch(`/api/shop`);
    let items = await res.json();
    const catMap = { 'privileges': 'Imtiyoz', 'dcoin': 'Currency', 'cosmetics': 'Cosmetics' };
    const targetCat = catMap[currentCategory] || currentCategory;
    items = items.filter(i => i.category === targetCat);

    grid.innerHTML = items.map(i => `
        <div class="card">
            <div style="height:220px; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.1)">
                <img src="${i.image}" class="card-img" style="height:${i.category === 'Currency' ? '120px' : '100%'}; width:${i.category === 'Currency' ? 'auto' : '100%'}; object-fit: ${i.category === 'Currency' ? 'contain' : 'cover'}; filter: ${i.category === 'Currency' ? 'none' : 'brightness(0.7)'}">
            </div>
            <div class="card-body">
                <span class="card-tag">${i.category}</span>
                <h3>${i.name}</h3>
                <div class="card-footer">
                    <span class="price" style="color:#ffd700">
                        ${i.category === 'Currency' ? i.price + ' $' : i.price + ' <img src="/static/assets/img/coin.png" style="width:14px; vertical-align:middle; margin-left:4px;">'}
                    </span>
                    <button onclick="purchaseItem(${i.id})" class="btn btn-primary">${i.category === 'Currency' ? 'Xarid qilish' : 'Sotib olish'}</button>
                </div>
            </div>
        </div>
    `).join('');
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-btn')) {
        setCategory(e.target.textContent);
    }
});

async function renderAdmin() {
    if (!currentUser || currentUser.role !== 'admin') { window.location.href = '/'; return; }
    const container = document.getElementById('admin-content');
    if (!container) return;
    const res = await fetch(`/api/users`);
    const usersList = await res.json();
    container.innerHTML = `
        <h2 style="margin-bottom:3rem">SYSTEM <span>ADMINISTRATION</span></h2>
        <div class="card" style="padding:0; border-color:var(--primary-dim);">
            <table style="width:100%; border-collapse:collapse">
                <thead><tr style="background:rgba(255,255,255,0.05)"><th style="padding:1.5rem; text-align:left">SUBJECT</th><th style="padding:1.5rem">ROLE</th><th style="padding:1.5rem">DCOIN</th><th style="padding:1.5rem">ACTIONS</th></tr></thead>
                <tbody>
                    ${usersList.map(u => `
                        <tr style="border-top:1px solid var(--glass-border); ${u.pending_privilege ? 'background:rgba(255,215,0,0.1); border-left:4px solid #ffd700;' : ''}">
                            <td style="padding:1.5rem">
                                <div style="display:flex; align-items:center; gap:15px">
                                    <img src="${u.avatar}" style="width:40px; height:40px; border-radius:50%">
                                    <div>
                                        <p style="font-weight:700">${u.username}</p>
                                        ${u.pending_privilege ? `<p style="font-size:0.7rem; color:#ffd700">Bought: ${u.last_purchase || 'Unknown'}</p>` : ''}
                                    </div>
                                </div>
                            </td>
                            <td style="padding:1.5rem; text-align:center"><span class="role-badge ${u.role}">${u.role.toUpperCase()}</span></td>
                            <td style="padding:1.5rem; text-align:center; font-weight:800; color:#ffd700">${u.dcoins} <img src="/static/assets/img/coin.png" style="width:13px; vertical-align:middle;"></td>
                            <td style="padding:1.5rem; text-align:center">
                                <button onclick="adminAddDCoin(\'${u.username}\')" class="btn-glass" style="border-color:#ffd700; color:#ffd700; padding:6px 12px; margin-right:5px">+100</button>
                                <button onclick="adminToggleBan(\'${u.username}\', ${u.banned})" class="btn-glass" style="border-color:${u.banned ? '#00f2ea' : 'var(--secondary)'}; color:${u.banned ? '#00f2ea' : 'var(--secondary)'}; padding:6px 12px">${u.banned ? 'RESTORE' : 'BAN'}</button>
                                ${u.role === 'vip' ? `<button onclick="adminRemoveVIP(\'${u.username}\')" class="btn-glass" style="border-color:#ff4444; color:#ff4444; padding:6px 12px; margin-left:5px">DEMOTE</button>` : ''}
                                ${u.pending_privilege ? `<button onclick="adminClearGlow(\'${u.username}\')" class="btn-glass" style="border-color:#ffd700; color:#ffd700; padding:6px 12px; margin-left:5px">ACK</button>` : ''}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

async function renderNews() {
    const grid = document.getElementById('news-grid');
    if (!grid) return;
    const res = await fetch(`/api/news`);
    const news = await res.json();
    grid.innerHTML = news.map(n => `
        <div class="card">
            <div style="height:200px; background:linear-gradient(45deg, #050508, #1a1a2e); display:flex; align-items:center; justify-content:center;"><i class="fas fa-satellite-dish" style="font-size:3rem; color:var(--primary-dim)"></i></div>
            <div class="card-body"><span class="card-tag">${n.tag}</span><h3>${n.title}</h3><p>${n.desc}</p><div class="card-footer"><small>${n.date}</small></div></div>
        </div>
    `).join('');
}

async function renderBans() {
    const tbody = document.getElementById('bans-tbody');
    if (!tbody) return;
    const res = await fetch(`/api/bans`);
    const banned = await res.json();
    tbody.innerHTML = banned.map(u => `
        <tr style="border-top:1px solid var(--glass-border);">
            <td style="padding:1.5rem;"><div style="display:flex; align-items:center; gap:15px"><img src="${u.avatar}" style="width:40px; height:40px; border-radius:50%"><p style="font-weight:700">${u.username}</p></div></td>
            <td style="padding:1.5rem; text-align:center; color:var(--text-muted)">Protocol Violation</td>
            <td style="padding:1.5rem; text-align:center"><span class="card-tag" style="background:rgba(255,0,80,0.1); color:var(--secondary)">OFFLINE</span></td>
        </tr>
    `).join('');
}

async function renderProfile() {
    if (!currentUser) return;
    const nameEl = document.getElementById('profile-name');
    if (nameEl) nameEl.innerHTML = `${currentUser.username} <small class="role-badge ${currentUser.role}">${currentUser.role}</small>`;
    const steamEl = document.getElementById('profile-steamid');
    if (steamEl) steamEl.textContent = currentUser.steam_id || 'LOCAL_AUTH';
    const avatarEl = document.getElementById('profile-avatar');
    if (avatarEl) avatarEl.src = currentUser.avatar;
    const creditsEl = document.getElementById('profile-credits');
    if (creditsEl) creditsEl.innerHTML = `${currentUser.dcoins} <img src="/static/assets/img/coin.png" style="width:14px; vertical-align:middle; margin-left:5px;">`;
    const rankEl = document.getElementById('profile-rank');
    if (rankEl) rankEl.textContent = currentUser.rank || 'Member';
}

async function renderForum() {
    const container = document.getElementById('forum-content');
    if (!container) return;
    const res = await fetch(`/api/forum/threads`);
    const threads = await res.json();

    container.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem;">
            <h2>COMMUNITY <span>FORUM</span></h2>
            <button onclick="document.getElementById('thread-modal').style.display='flex'" class="btn btn-primary">New Thread</button>
        </div>
        ${threads.map(t => `
            <div class="card" onclick="viewThread(${t.id})" style="margin-bottom:1rem; cursor:pointer; transition:transform 0.2s; display:grid; grid-template-columns: 1fr 100px 100px; padding:1.5rem; align-items:center;">
                <div>
                    <span class="card-tag">${t.category}</span>
                    <h4 style="margin:5px 0;">${t.title}</h4>
                    <p style="font-size:0.75rem; color:var(--text-muted)">By ${t.author} вЂў ${t.date}</p>
                </div>
                <div style="text-align:center">
                    <p style="font-weight:700; font-size:1.2rem;">${t.replies}</p>
                    <small>Replies</small>
                </div>
                <div style="text-align:right">
                    <i class="fas fa-chevron-right" style="color:var(--glass-border)"></i>
                </div>
            </div>
        `).join('')}
    `;
}

async function viewThread(id) {
    const container = document.getElementById('forum-content');
    container.innerHTML = '<div style="text-align:center; padding:50px;"><i class="fas fa-circle-notch fa-spin"></i> Loading...</div>';
    const res = await fetch(`/api/forum/thread/${id}`);
    const t = await res.json();

    container.innerHTML = `
        <button onclick="renderForum()" class="btn btn-glass" style="margin-bottom:1rem;"><i class="fas fa-arrow-left"></i> Back to Forum</button>
        <div class="card" style="margin-bottom:2rem;">
            <div style="border-bottom:1px solid var(--glass-border); padding-bottom:1rem; margin-bottom:1rem;">
                <span class="card-tag">Topic</span>
                <h2 style="margin:10px 0;">${t.title}</h2>
                <div style="display:flex; gap:10px; font-size:0.9rem; color:var(--text-muted);">
                    <span><i class="fas fa-user"></i> ${t.author}</span>
                    <span><i class="fas fa-clock"></i> ${t.date}</span>
                </div>
            </div>
            <div style="font-size:1.1rem; line-height:1.6; color:#ddd; white-space:pre-wrap;">${t.content || 'No content.'}</div>
        </div>
        <h3 style="margin-bottom:1rem;">Replies (${t.replies.length})</h3>
        <div style="display:flex; flex-direction:column; gap:1rem; margin-bottom:2rem;">
            ${t.replies.map(r => `
                <div class="card" style="padding:1rem; display:flex; gap:1rem;">
                    <img src="${r.avatar}" style="width:40px; height:40px; border-radius:50%;">
                    <div style="flex:1;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                            <span style="font-weight:700; color:var(--primary)">${r.user}</span>
                            <small style="color:var(--text-muted)">${r.date}</small>
                        </div>
                        <p>${r.content}</p>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="card">
            <h4>Leave a Reply</h4>
            <textarea id="reply-content" rows="4" style="width:100%; background:rgba(0,0,0,0.2); border:1px solid var(--glass-border); color:#fff; padding:1rem; margin:1rem 0; border-radius:8px;"></textarea>
            <button onclick="submitReply(${t.id})" class="btn btn-primary">Post Reply</button>
        </div>
    `;
}

async function submitThread() {
    const title = document.getElementById('new-thread-title').value;
    const category = document.getElementById('new-thread-category').value;
    const content = document.getElementById('new-thread-content').value;
    const res = await fetch(`${API_BASE}/api/forum/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, content })
    });
    if (res.ok) {
        document.getElementById('thread-modal').style.display = 'none';
        renderForum();
        showNotification('Thread created!', 'success');
    }
}

function closeThreadModal() {
    document.getElementById('thread-modal').style.display = 'none';
}

async function submitReply(threadId) {
    const content = document.getElementById('reply-content').value;
    if (!content) return;
    const res = await fetch(`${API_BASE}/api/forum/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ thread_id: threadId, content })
    });
    if (res.ok) {
        viewThread(threadId);
        showNotification('Reply posted!', 'success');
    }
}

async function uploadAvatar() {
    const input = document.getElementById('avatar-upload');
    if (!input.files || !input.files[0]) return;
    const formData = new FormData();
    formData.append('file', input.files[0]);
    showNotification('Uploading...', 'info');
    const res = await fetch(`${API_BASE}/api/user/upload-avatar`, {
        method: 'POST',
        body: formData
    });
    if (res.ok) {
        showNotification('Avatar updated!', 'success');
        setTimeout(() => window.location.reload(), 1000);
    }
}

// --- Chat System ---
let chatInterval = null;
function initChat() {
    const widget = document.getElementById('chat-widget');
    if (!widget) return;
    loadChatMessages();
    chatInterval = setInterval(loadChatMessages, 3000);
}

function toggleChat() {
    const widget = document.getElementById('chat-widget');
    const btn = document.getElementById('chat-toggle-btn');
    if (widget.classList.contains('chat-anim-open')) {
        widget.classList.remove('chat-anim-open');
        widget.classList.add('chat-anim-close');
        setTimeout(() => {
            btn.style.display = 'block';
            btn.style.opacity = '0';
            btn.style.transition = 'opacity 0.3s';
            setTimeout(() => btn.style.opacity = '1', 10);
        }, 400);
        setTimeout(() => {
            widget.style.display = 'none';
            widget.classList.remove('chat-anim-close');
        }, 600);
    } else {
        widget.classList.remove('chat-anim-close');
        widget.style.display = 'flex';
        widget.classList.add('chat-anim-open');
        btn.style.display = 'none';
        loadChatMessages();
    }
}

async function loadChatMessages() {
    const container = document.getElementById('chat-messages');
    if (!container || container.offsetParent === null) return;
    const res = await fetch(`${API_BASE}/api/chat/messages`);
    const msgs = await res.json();
    const wasScrolledToBottom = container.scrollHeight - container.scrollTop === container.clientHeight;
    container.innerHTML = msgs.map(m => `
        <div style="display:flex; gap:10px; margin-bottom:5px;">
            <img src="${m.avatar}" style="width:24px; height:24px; border-radius:50%">
            <div>
                <div style="display:flex; align-items:center; gap:5px;">
                    <span style="font-size:0.8rem; font-weight:700; color:${m.role === 'admin' ? 'var(--secondary)' : '#fff'}">${m.user}</span>
                    <span style="font-size:0.6rem; color:var(--text-muted)">${m.time}</span>
                </div>
                <p style="font-size:0.9rem; color:#ddd; word-break:break-word;">${m.content}</p>
            </div>
        </div>
    `).join('');
    if (wasScrolledToBottom) container.scrollTop = container.scrollHeight;
}

async function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const content = input.value.trim();
    if (!content) return;
    const res = await fetch(`${API_BASE}/api/chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
    });
    if (res.ok) {
        input.value = '';
        loadChatMessages();
    }
}

// --- Admin Features ---
async function renderAdminNews() {
    setActiveAdminTab('news');
    const container = document.getElementById('admin-content');
    const res = await fetch(`${API_BASE}/api/news`);
    const news = await res.json();
    container.innerHTML = `
        <div class="card">
            <h3>Add News</h3>
            <div style="display:grid; gap:10px; margin-bottom:1rem;">
                <input id="news-title" placeholder="Title" style="padding:10px; color:#fff; background:rgba(255,255,255,0.05); border:1px solid var(--glass-border); border-radius:4px;">
                <input id="news-tag" placeholder="Tag" style="padding:10px; color:#fff; background:rgba(255,255,255,0.05); border:1px solid var(--glass-border); border-radius:4px;">
                <textarea id="news-desc" placeholder="Summary" rows="3" style="padding:10px; color:#fff; background:rgba(255,255,255,0.05); border:1px solid var(--glass-border); border-radius:4px;"></textarea>
                <button onclick="adminAddNews()" class="btn btn-primary">Publish</button>
            </div>
        </div>
        <div style="display:grid; gap:10px;">
            ${news.map(n => `
                <div class="card" style="display:flex; justify-content:space-between; align-items:center; padding:1rem;">
                    <div><b>${n.title}</b> <span class="card-tag">${n.tag}</span></div>
                    <button onclick="adminDeleteNews(${n.id})" class="btn btn-glass" style="color:var(--secondary);">Delete</button>
                </div>
            `).join('')}
        </div>
    `;
}

async function adminAddNews() {
    const title = document.getElementById('news-title').value;
    const tag = document.getElementById('news-tag').value;
    const desc = document.getElementById('news-desc').value;
    const res = await fetch(`${API_BASE}/api/admin/news/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, tag, desc })
    });
    if (res.ok) renderAdminNews();
}

async function adminDeleteNews(id) {
    if (!confirm('Are you sure?')) return;
    const res = await fetch(`${API_BASE}/api/admin/news/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    });
    if (res.ok) renderAdminNews();
}

async function renderAdminServers() {
    setActiveAdminTab('servers');
    const container = document.getElementById('admin-content');
    const res = await fetch(`${API_BASE}/api/servers?t=${Date.now()}`);
    const servers = await res.json();
    container.innerHTML = `
        <div class="card">
            <h3>Add New Server</h3>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:1rem;">
                <input id="srv-name" placeholder="Name" style="padding:10px; color:#fff; background:rgba(0,0,0,0.2); border:1px solid var(--glass-border); border-radius:4px;">
                <input id="srv-ip" placeholder="IP Address" style="padding:10px; color:#fff; background:rgba(0,0,0,0.2); border:1px solid var(--glass-border); border-radius:4px;">
                <input id="srv-port" placeholder="Port" type="number" style="padding:10px; color:#fff; background:rgba(0,0,0,0.2); border:1px solid var(--glass-border); border-radius:4px;">
                <input id="srv-map" placeholder="Map" style="padding:10px; color:#fff; background:rgba(0,0,0,0.2); border:1px solid var(--glass-border); border-radius:4px;">
                <button onclick="adminAddServer()" class="btn btn-primary" style="grid-column: span 2">Add Server</button>
            </div>
        </div>
        <div id="srv-edit-container" style="display:none; margin-bottom:1rem;">
            <div class="card" style="border-color:var(--secondary)">
                <h3>Edit Server</h3>
                <input type="hidden" id="edit-srv-id">
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:1rem;">
                    <input id="edit-srv-name" placeholder="Name" style="padding:10px; color:#fff; background:rgba(0,0,0,0.2); border:1px solid var(--glass-border); border-radius:4px;">
                    <input id="edit-srv-ip" placeholder="IP Address" style="padding:10px; color:#fff; background:rgba(0,0,0,0.2); border:1px solid var(--glass-border); border-radius:4px;">
                    <input id="edit-srv-port" placeholder="Port" type="number" style="padding:10px; color:#fff; background:rgba(0,0,0,0.2); border:1px solid var(--glass-border); border-radius:4px;">
                    <input id="edit-srv-map" placeholder="Map" style="padding:10px; color:#fff; background:rgba(0,0,0,0.2); border:1px solid var(--glass-border); border-radius:4px;">
                    <div style="display:flex; gap:10px; grid-column: span 2;">
                        <button onclick="adminSaveServerUpdate()" class="btn btn-primary" style="flex:1">Save Changes</button>
                        <button onclick="document.getElementById('srv-edit-container').style.display='none'" class="btn btn-glass" style="flex:1">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
        <div style="display:grid; gap:10px;">
            ${servers.map(s => `
                <div class="card" style="display:flex; justify-content:space-between; align-items:center; padding:1rem;">
                    <div><b>${s.name}</b> <small>${s.ip}:${s.port}</small></div>
                    <div style="display:flex; gap:5px;">
                        <button onclick='adminEditServer(${JSON.stringify(s).replace(/'/g, "&apos;")})' class="btn btn-glass" style="color:var(--primary);">Edit</button>
                        <button onclick="adminDeleteServer(${s.id})" class="btn btn-glass" style="color:var(--secondary);">Delete</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

async function adminAddServer() {
    const name = document.getElementById('srv-name').value;
    const ip = document.getElementById('srv-ip').value;
    const port = document.getElementById('srv-port').value || 27015;
    const map = document.getElementById('srv-map').value || 'de_dust2';
    const res = await fetch(`${API_BASE}/api/admin/servers/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, ip, port, map })
    });
    if (res.ok) { showNotification('Server added!', 'success'); renderAdminServers(); }
}

async function adminDeleteServer(id) {
    if (!confirm('Are you sure?')) return;
    const res = await fetch(`${API_BASE}/api/admin/servers/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    });
    if (res.ok) { showNotification('Server deleted', 'success'); renderAdminServers(); }
}

function adminEditServer(server) {
    document.getElementById('srv-edit-container').style.display = 'block';
    document.getElementById('edit-srv-id').value = server.id;
    document.getElementById('edit-srv-name').value = server.name;
    document.getElementById('edit-srv-ip').value = server.ip;
    document.getElementById('edit-srv-port').value = server.port;
    document.getElementById('edit-srv-map').value = server.map;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function adminSaveServerUpdate() {
    const id = document.getElementById('edit-srv-id').value;
    const name = document.getElementById('edit-srv-name').value;
    const ip = document.getElementById('edit-srv-ip').value;
    const port = document.getElementById('edit-srv-port').value;
    const map = document.getElementById('edit-srv-map').value;
    const res = await fetch(`${API_BASE}/api/admin/servers/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name, ip, port, map })
    });

    if (res.ok) {
        showNotification('Server updated!', 'success');
        document.getElementById('srv-edit-container').style.display = 'none';
        renderAdminServers();
    } else {
        showNotification('Update failed', 'error');
    }
}

function renderAdminShop() {
    setActiveAdminTab('shop');
    document.getElementById('admin-content').innerHTML = `
        <div class="card"><h3 style="color:var(--text-muted)">Shop Management</h3><p>Feature in development.</p></div>
    `;
}

function setActiveAdminTab(tab) {
    ['users', 'news', 'servers', 'shop'].forEach(t => {
        const btn = document.getElementById(`btn-admin-${t}`);
        if (btn) {
            if (t === tab) { btn.classList.add('btn-primary'); btn.classList.remove('btn-glass'); }
            else { btn.classList.add('btn-glass'); btn.classList.remove('btn-primary'); }
        }
    });
}

// --- Servers Page ---
async function renderServers() {
    const grid = document.getElementById('servers-grid');
    if (!grid) return;

    // Show loading state
    grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 50px;"><i class="fas fa-sync fa-spin" style="font-size: 2rem; color: var(--primary);"></i><p style="margin-top: 10px;">Refreshing server data...</p></div>';

    const res = await fetch(`/api/servers?t=${Date.now()}`);
    const servers = await res.json();

    if (servers.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No servers found.</p>';
        return;
    }

    grid.innerHTML = servers.map(s => {
        const mapImg = `https://via.placeholder.com/400x200/050508/00f2ea?text=${s.map.toUpperCase()}`;
        return `
        <div class="server-card">
            <div class="server-map-bg" style="background-image: url('${mapImg}')">
                <span class="server-status ${s.status === 'online' ? 'status-online' : 'status-offline'}">${s.status}</span>
                <div style="z-index: 2"><h3 style="margin: 0;">${s.name}</h3></div>
            </div>
            <div class="server-info">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
                    <span style="color:var(--text-muted); font-size:0.8rem;"><i class="fas fa-map"></i> ${s.map}</span>
                </div>
                <div class="ip-box"><span>${s.ip}:${s.port}</span><i class="fas fa-copy copy-ip" onclick="copyIP('${s.ip}:${s.port}')"></i></div>
                <a href="steam://connect/${s.ip}:${s.port}" class="btn btn-primary connect-btn"><i class="fab fa-steam"></i> CONNECT</a>
            </div>
        </div>
    `}).join('');
}

function showNotification(msg, type = 'info') {
    const note = document.createElement('div');
    note.style = `position:fixed; bottom:30px; right:30px; padding:20px 30px; background:var(--bg-dark); border:1px solid var(--glass-border); border-left:4px solid ${type === 'error' ? 'var(--secondary)' : 'var(--primary)'}; border-radius:12px; z-index:99999; backdrop-filter:blur(20px); animation: slideIn 0.4s forwards;`;
    note.innerHTML = `<div style="display:flex; align-items:center; gap:15px"><i class="fas fa-${type === 'error' ? 'skull' : 'satellite'}" style="color:${type === 'error' ? 'var(--secondary)' : 'var(--primary)'}"></i> <span style="font-weight:600">${msg}</span></div>`;
    document.body.appendChild(note);
    setTimeout(() => note.remove(), 4000);
}

async function resendVerification() {
    const res = await fetch(`${API_BASE}/api/auth/resend-verification`, { method: 'POST' });
    const data = await res.json();
    if (res.ok) {
        showNotification(data.msg, 'success');
    } else {
        showNotification(data.error || t('notice.refresh_error', 'Error'), 'error');
    }
}

// Global Exports
window.renderServers = renderServers;
window.uploadAvatar = uploadAvatar;
window.toggleChat = toggleChat;
window.sendChatMessage = sendChatMessage;
window.submitThread = submitThread;
window.closeThreadModal = closeThreadModal;
window.submitReply = submitReply;
window.viewThread = viewThread;
window.renderAdminNews = renderAdminNews;
window.renderAdminServers = renderAdminServers;
window.renderAdminShop = renderAdminShop;
window.adminAddNews = adminAddNews;
window.adminDeleteNews = adminDeleteNews;
window.adminAddServer = adminAddServer;
window.adminDeleteServer = adminDeleteServer;
window.resendVerification = resendVerification;
window.toggleAuthForm = toggleAuthForm;
window.attemptRegister = attemptRegister;
window.copyIP = (ip) => {
    navigator.clipboard.writeText(ip);
    showNotification(t('notice.ip_copied', 'IP copied to clipboard!'), 'success');
};
window.setLanguage = setLanguage;
window.getCurrentLanguage = () => currentLang;

