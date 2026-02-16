// Projects page - Expandable project cards
document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        const header = card.querySelector('.project-header');
        const expandBtn = card.querySelector('.expand-btn');
        
        if (header && expandBtn) {
            // Make both header and button clickable
            [header, expandBtn].forEach(element => {
                element.addEventListener('click', (e) => {
                    e.stopPropagation();
                    toggleProject(card);
                });
            });
        }
    });

    // Initialize carousels
    document.querySelectorAll('.carousel').forEach(setupCarousel);
});

function toggleProject(card) {
    const isExpanded = card.classList.contains('expanded');
    
    // Close all other cards
    document.querySelectorAll('.project-card.expanded').forEach(otherCard => {
        if (otherCard !== card) {
            otherCard.classList.remove('expanded');
        }
    });
    
    // Toggle current card
    if (isExpanded) {
        card.classList.remove('expanded');
    } else {
        card.classList.add('expanded');
        // Scroll to card
        setTimeout(() => {
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
}

function setupCarousel(carousel) {
    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
    const prevBtn = carousel.querySelector('.carousel-btn.prev');
    const nextBtn = carousel.querySelector('.carousel-btn.next');
    const dots = Array.from(carousel.querySelectorAll('.carousel-dot'));

    if (!track || slides.length === 0) return;

    let index = 0;
    let autoTimer;

    const update = () => {
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    };

    const goNext = () => {
        index = (index + 1) % slides.length;
        update();
    };

    const goPrev = () => {
        index = (index - 1 + slides.length) % slides.length;
        update();
    };

    if (nextBtn) nextBtn.addEventListener('click', goNext);
    if (prevBtn) prevBtn.addEventListener('click', goPrev);

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            index = i;
            update();
        });
    });

    const startAuto = () => {
        autoTimer = setInterval(goNext, 4500);
    };

    const stopAuto = () => {
        clearInterval(autoTimer);
    };

    carousel.addEventListener('mouseenter', stopAuto);
    carousel.addEventListener('mouseleave', startAuto);

    update();
    startAuto();
}
