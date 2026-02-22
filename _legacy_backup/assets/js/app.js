// App entry point

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
});

function initNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // Animate toggle icon (simple state switch for now)
            menuToggle.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
        });
    }

    // Scroll effect for header
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(15, 15, 18, 0.98)';
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4)';
        } else {
            header.style.backgroundColor = 'rgba(15, 15, 18, 0.95)';
            header.style.boxShadow = 'none';
        }
    });

    initAnimations();
}

// Modal Logic
window.openModal = function (type) {
    const modal = document.getElementById('purchaseModal');
    const title = document.getElementById('modalTitle');
    if (modal && title) {
        title.textContent = `${type} Sotib Olish`;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
}

window.closeModal = function () {
    const modal = document.getElementById('purchaseModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modal on click outside
window.onclick = function (event) {
    const modal = document.getElementById('purchaseModal');
    if (event.target == modal) {
        closeModal();
    }
}

// Scroll Animations
function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        threshold: 0.1
    });

    // Target elements to animate
    const hiddenElements = document.querySelectorAll('.server-card, .news-card, .rule-category, .pricing-card');
    hiddenElements.forEach((el) => {
        el.classList.add('hidden'); // Add initial hidden class
        observer.observe(el);
    });
}
