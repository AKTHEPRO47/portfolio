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
