// Enhanced Projects functionality with search and filter
document.addEventListener('DOMContentLoaded', () => {
    // Project card expansion
    const expandButtons = document.querySelectorAll('.expand-btn');
    
    expandButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const projectCard = btn.closest('.project-card');
            projectCard.classList.toggle('expanded');
        });
    });

    // Project Search functionality
    const searchInput = document.getElementById('projectSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            filterProjects(searchTerm);
        });
    }

    // Project Filter by technology
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            filterProjectsByTech(filter);
        });
    });

    function filterProjects(searchTerm) {
        const projectCards = document.querySelectorAll('.project-card');
        let visibleCount = 0;

        projectCards.forEach(card => {
            const projectName = card.querySelector('h2').textContent.toLowerCase();
            const projectDesc = card.querySelector('.project-info p').textContent.toLowerCase();
            const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
            
            const matchesSearch = 
                projectName.includes(searchTerm) || 
                projectDesc.includes(searchTerm) ||
                tags.some(tag => tag.includes(searchTerm));

            if (matchesSearch) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease-out';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Show "no results" message if needed
        showNoResultsMessage(visibleCount);
    }

    function filterProjectsByTech(tech) {
        const projectCards = document.querySelectorAll('.project-card');
        let visibleCount = 0;

        projectCards.forEach(card => {
            if (tech === 'all') {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease-out';
                visibleCount++;
            } else {
                const tags = Array.from(card.querySelectorAll('.tag')).map(tag => 
                    tag.textContent.toLowerCase()
                );
                
                const matchesTech = tags.some(tag => tag.includes(tech.toLowerCase()));
                
                if (matchesTech) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease-out';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            }
        });

        showNoResultsMessage(visibleCount);
    }

    function showNoResultsMessage(count) {
        let noResults = document.getElementById('noResults');
        
        if (count === 0) {
            if (!noResults) {
                noResults = document.createElement('div');
                noResults.id = 'noResults';
                noResults.className = 'no-results';
                noResults.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8"/>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        <line x1="8" y1="11" x2="14" y2="11"/>
                    </svg>
                    <p>No projects found matching your criteria</p>
                    <button class="btn btn-secondary" onclick="resetFilters()">Reset Filters</button>
                `;
                document.querySelector('.projects-grid').appendChild(noResults);
            }
            noResults.style.display = 'flex';
        } else if (noResults) {
            noResults.style.display = 'none';
        }
    }
});

// Reset filters function (global scope for inline onclick)
function resetFilters() {
    const searchInput = document.getElementById('projectSearch');
    if (searchInput) {
        searchInput.value = '';
    }
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === 'all') {
            btn.classList.add('active');
        }
    });
    
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.style.display = 'block';
    });
    
    const noResults = document.getElementById('noResults');
    if (noResults) {
        noResults.style.display = 'none';
    }
}
