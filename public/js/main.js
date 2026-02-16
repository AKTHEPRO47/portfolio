// Main JavaScript for global functionality
document.addEventListener('DOMContentLoaded', () => {
    // Loading Screen
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 800);
        });
    }

    // Dark/Light Mode Toggle
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    // Apply saved theme
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const currentTheme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
            localStorage.setItem('theme', currentTheme);
            
            // Add click animation
            themeToggle.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                themeToggle.style.transform = 'rotate(0deg)';
            }, 500);
        });
    }

    // Typing Animation
    const typingText = document.getElementById('typingText');
    if (typingText) {
        const texts = [
            'AI & Analytics Student',
            'Product Builder',
            'Aspiring Entrepreneur',
            'Full-Stack Developer'
        ];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function type() {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typingText.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                typingText.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }

            if (!isDeleting && charIndex === currentText.length) {
                isDeleting = true;
                typingSpeed = 2000; // Pause at end
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typingSpeed = 500; // Pause before next word
            }

            setTimeout(type, typingSpeed);
        }

        type();
    }

    // Scroll to Top Button
    const scrollToTopBtn = document.getElementById('scrollToTop');
    const scrollProgress = document.getElementById('scrollProgress');
    
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Scroll progress bar
    if (scrollProgress) {
        const updateProgress = () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            scrollProgress.style.width = `${progress}%`;
        };

        window.addEventListener('scroll', updateProgress);
        window.addEventListener('resize', updateProgress);
        updateProgress();
    }

    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.querySelector('.nav-links');
    const navOverlay = document.getElementById('navOverlay');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
            if (navOverlay) {
                navOverlay.classList.toggle('active');
            }
            document.body.classList.toggle('menu-open');
        });
    }

    const closeMobileMenu = () => {
        if (navLinks) {
            navLinks.classList.remove('active');
        }
        if (mobileMenuToggle) {
            mobileMenuToggle.classList.remove('active');
        }
        if (navOverlay) {
            navOverlay.classList.remove('active');
        }
        document.body.classList.remove('menu-open');
    };

    if (navOverlay) {
        navOverlay.addEventListener('click', closeMobileMenu);
    }

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });

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

    document.querySelectorAll('.page-header, .intro-section, .skills-section, .experience-section, .projects-section').forEach(el => {
        el.classList.add('scroll-fade-up');
        scrollObserver.observe(el);
    });

    // Animate skill bars on scroll with actual animation
    const skillObserverOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const targetWidth = progressBar.style.width;
                progressBar.style.width = '0%';
                setTimeout(() => {
                    progressBar.style.transition = 'width 1.5s ease-out';
                    progressBar.style.width = targetWidth;
                }, 100);
            }
        });
    }, skillObserverOptions);

    document.querySelectorAll('.skill-progress').forEach(bar => {
        skillObserver.observe(bar);
    });

    // Enhanced project card hover effects
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Parallax scroll effect
    const parallaxItems = document.querySelectorAll('[data-parallax]');
    if (parallaxItems.length) {
        const handleParallax = () => {
            const scrollTop = window.pageYOffset;
            parallaxItems.forEach(item => {
                const speed = parseFloat(item.getAttribute('data-parallax')) || 0.2;
                item.style.transform = `translateY(${scrollTop * speed}px)`;
            });
        };
        window.addEventListener('scroll', () => requestAnimationFrame(handleParallax));
        handleParallax();
    }

    // Copy email button (contact page)
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    const copyEmailStatus = document.getElementById('copyEmailStatus');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', async () => {
            const email = copyEmailBtn.getAttribute('data-email');
            try {
                await navigator.clipboard.writeText(email);
                if (copyEmailStatus) {
                    copyEmailStatus.textContent = 'Email copied!';
                }
            } catch (err) {
                if (copyEmailStatus) {
                    copyEmailStatus.textContent = 'Copy failed. Please copy manually.';
                }
            }
        });
    }

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
