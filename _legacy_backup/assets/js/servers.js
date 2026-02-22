// Mock Server Data
const servers = [
    {
        id: 1,
        name: 'Fgaming [PUBLIC] #1',
        ip: '192.168.1.1:27015',
        map: 'de_mirage',
        players: 12,
        maxPlayers: 24,
        status: 'online'
    },
    {
        id: 2,
        name: 'Fgaming [AWP] LEGO',
        ip: '192.168.1.1:27016',
        map: 'awp_lego_2',
        players: 8,
        maxPlayers: 20,
        status: 'online'
    },
    {
        id: 3,
        name: 'Fgaming [MANIAC]',
        ip: '192.168.1.1:27017',
        map: 'mk_maniac',
        players: 0,
        maxPlayers: 32,
        status: 'offline'
    },
    {
        id: 4,
        name: 'Fgaming [BHOP] HARD',
        ip: '192.168.1.1:27018',
        map: 'bhop_arcane',
        players: 4,
        maxPlayers: 16,
        status: 'online'
    }
];

let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
    renderServers();
    initFilters();
});

function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            // Get filter value
            const filter = btn.textContent.trim().toLowerCase();
            currentFilter = filter === 'barchasi' ? 'all' : filter;
            renderServers();
        });
    });
}

function renderServers() {
    const serverList = document.getElementById('server-list');
    if (!serverList) return;

    // Filter servers
    let filteredServers = servers;
    if (currentFilter !== 'all') {
        filteredServers = servers.filter(server => {
            const name = server.name.toLowerCase();
            return name.includes(currentFilter);
        });
    }

    if (filteredServers.length === 0) {
        serverList.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: var(--text-muted);">
                <p style="font-size: 1.2rem;">Hech qanday server topilmadi.</p>
            </div>
        `;
        return;
    }

    serverList.innerHTML = filteredServers.map(server => {
        const percent = (server.players / server.maxPlayers) * 100;
        const colorClass = server.status === 'online' ? 'online' : 'offline';

        return `
        <div class="server-card hidden">
            <div class="server-info">
                <h4>${server.name}</h4>
                <span class="map-name">${server.map}</span>
            </div>
            <div class="server-status">
                <div class="server-players">
                    <span>${server.players}/${server.maxPlayers}</span>
                    <span class="status-indicator ${colorClass}"></span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percent}%"></div>
                </div>
                <button class="btn-copy" onclick="copyIP('${server.ip}')">IP Nusxalash</button>
            </div>
        </div>
        `;
    }).join('');

    // Re-initialize animations
    setTimeout(() => {
        const hiddenElements = document.querySelectorAll('.server-card.hidden');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        hiddenElements.forEach((el) => {
            observer.observe(el);
        });
    }, 100);
}

function copyIP(ip) {
    navigator.clipboard.writeText(ip).then(() => {
        // Show notification instead of alert
        const notification = document.createElement('div');
        notification.className = 'notification notification-success';
        notification.textContent = `IP nusxalandi: ${ip}`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 2000);
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = ip;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert(`IP nusxalandi: ${ip}`);
    });
}

// Make copyIP globally available
window.copyIP = copyIP;
