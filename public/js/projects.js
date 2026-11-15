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

    setupProjectTools(projectCards);

    // Initialize carousels
    document.querySelectorAll('.carousel').forEach(setupCarousel);
});

function setupProjectTools(cards) {
    const search = document.getElementById('projectSearch');
    const results = document.getElementById('projectResults');
    const shareStatus = document.getElementById('projectShareStatus');

    function filterProjects() {
        const terms = search.value.toLowerCase().trim().split(/\s+/);
        let count = 0;

        cards.forEach(card => {
            const summary = card.querySelector('.project-info').textContent.toLowerCase();
            card.hidden = !terms.every(term => summary.includes(term));
            if (!card.hidden) count++;
        });

        results.textContent = count
            ? `${count} ${count === 1 ? 'project' : 'projects'}`
            : 'No projects match your search.';
    }

    function openLinkedProject() {
        const card = Array.from(cards).find(project => '#' + project.id === window.location.hash);
        if (!card) return;

        if (card.hidden) {
            search.value = '';
            filterProjects();
        }
        if (!card.classList.contains('expanded')) toggleProject(card);
    }

    if (!search) return;

    cards.forEach(card => {
        const title = card.querySelector('h2').textContent;
        const link = document.createElement('a');
        link.className = 'project-share';
        link.href = '#' + card.id;
        link.textContent = 'Project link';
        link.setAttribute('aria-label', 'Link to ' + title);
        card.querySelector('.project-details').append(link);

        if (navigator.clipboard?.writeText) {
            link.textContent = 'Copy project link';
            link.setAttribute('aria-label', 'Copy link to ' + title);
            link.addEventListener('click', async event => {
                if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
                event.preventDefault();

                try {
                    await navigator.clipboard.writeText(link.href);
                    shareStatus.textContent = 'Link copied for ' + title + '.';
                    link.textContent = 'Link copied';
                } catch {
                    window.location.hash = card.id;
                    shareStatus.textContent = 'Copy the project link from the address bar.';
                    link.textContent = 'Link in address bar';
                }
            });
        }
    });

    search.addEventListener('input', filterProjects);
    window.addEventListener('hashchange', openLinkedProject);
    document.getElementById('projectTools').hidden = false;
    filterProjects();
    openLinkedProject();
}

function toggleProject(card) {
    const isExpanded = card.classList.contains('expanded');
    
    // Close all other cards
    document.querySelectorAll('.project-card.expanded').forEach(otherCard => {
        if (otherCard !== card) {
            otherCard.classList.remove('expanded');
            otherCard.querySelector('.expand-btn').setAttribute('aria-expanded', 'false');
        }
    });
    
    // Toggle current card
    card.querySelector('.expand-btn').setAttribute('aria-expanded', String(!isExpanded));
    if (isExpanded) {
        card.classList.remove('expanded');
    } else {
        card.classList.add('expanded');
        // Scroll to card
        setTimeout(() => {
            const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            card.scrollIntoView({ behavior: reduceMotion ? 'instant' : 'smooth', block: 'nearest' });
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
