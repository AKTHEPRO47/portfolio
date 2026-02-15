// Main JavaScript for global functionality
document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Scroll Animations
    const scrollObserverOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, scrollObserverOptions);

    // Add scroll animations to elements
    document.querySelectorAll('.project-card').forEach((el, index) => {
        el.classList.add('scroll-fade');
        el.style.transitionDelay = `${index * 0.1}s`;
        scrollObserver.observe(el);
    });

    document.querySelectorAll('.skill-category').forEach((el, index) => {
        el.classList.add('scroll-scale');
        el.style.transitionDelay = `${index * 0.1}s`;
        scrollObserver.observe(el);
    });

    document.querySelectorAll('.timeline-item').forEach((el, index) => {
        if (index % 2 === 0) {
            el.classList.add('scroll-slide-left');
        } else {
            el.classList.add('scroll-slide-right');
        }
        el.style.transitionDelay = `${index * 0.15}s`;
        scrollObserver.observe(el);
    });

    document.querySelectorAll('.about-section, .contact-section').forEach(el => {
        el.classList.add('scroll-fade');
        scrollObserver.observe(el);
    });

    // Animate skill bars on scroll
    const skillObserverOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.width = entry.target.getAttribute('data-width') || entry.target.style.width;
            }
        });
    }, skillObserverOptions);

    document.querySelectorAll('.skill-progress').forEach(bar => {
        skillObserver.observe(bar);
    });

    // Virat Kohli Easter Egg - Press 'V' then 'K'
    let keySequence = '';
    let keyTimeout;

    document.addEventListener('keydown', (e) => {
        clearTimeout(keyTimeout);
        
        keySequence += e.key.toLowerCase();
        
        if (keySequence.includes('vk') || keySequence.includes('kohli')) {
            showEasterEgg();
            keySequence = '';
        }
        
        // Reset sequence after 2 seconds
        keyTimeout = setTimeout(() => {
            keySequence = '';
        }, 2000);

        // Close easter egg with ESC
        if (e.key === 'Escape') {
            closeEasterEgg();
        }
    });
});

function showEasterEgg() {
    const easterEgg = document.getElementById('viratEasterEgg');
    const overlay = document.getElementById('easterEggOverlay');
    
    if (easterEgg && overlay) {
        overlay.classList.add('active');
        easterEgg.classList.add('active');
        
        // Play celebration sound effect (optional)
        console.log('🏏 King Kohli Easter Egg Activated! 👑');
    }
}

function closeEasterEgg() {
    const easterEgg = document.getElementById('viratEasterEgg');
    const overlay = document.getElementById('easterEggOverlay');
    
    if (easterEgg && overlay) {
        overlay.classList.remove('active');
        easterEgg.classList.remove('active');
    }
}

// Close easter egg when clicking overlay
document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('easterEggOverlay');
    if (overlay) {
        overlay.addEventListener('click', closeEasterEgg);
    }
});
