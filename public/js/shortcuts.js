// Keyboard Shortcuts Handler
document.addEventListener('DOMContentLoaded', () => {
    const shortcutsPanel = document.getElementById('shortcutsPanel');
    const shortcutsCloseBtn = document.getElementById('shortcutsCloseBtn');
    
    // Close shortcuts panel
    if (shortcutsCloseBtn) {
        shortcutsCloseBtn.addEventListener('click', () => {
            shortcutsPanel.classList.remove('active');
        });
    }

    // Keyboard shortcut handler
    document.addEventListener('keydown', (e) => {
        // Ignore if user is typing in an input field
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            // Allow ESC to close panels even in input fields
            if (e.key === 'Escape') {
                e.target.blur();
                closeAllPanels();
            }
            return;
        }

        // Show/Hide shortcuts panel with ?
        if (e.key === '?' || (e.shiftKey && e.key === '/')) {
            e.preventDefault();
            shortcutsPanel.classList.toggle('active');
            return;
        }

        // Alt + A: Open AI Assistant
        if (e.altKey && e.key.toLowerCase() === 'a') {
            e.preventDefault();
            const aiChatContainer = document.getElementById('aiChatContainer');
            const aiChatInput = document.getElementById('aiChatInput');
            if (aiChatContainer) {
                aiChatContainer.classList.add('active');
                if (aiChatInput) {
                    setTimeout(() => aiChatInput.focus(), 100);
                }
            }
            return;
        }

        // Alt + M: Toggle Music Player
        if (e.altKey && e.key.toLowerCase() === 'm') {
            e.preventDefault();
            const musicPlayer = document.getElementById('musicPlayer');
            if (musicPlayer) {
                musicPlayer.classList.toggle('minimized');
            }
            return;
        }

        // Alt + T: Toggle Theme
        if (e.altKey && e.key.toLowerCase() === 't') {
            e.preventDefault();
            document.body.classList.toggle('light-mode');
            const currentTheme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
            localStorage.setItem('theme', currentTheme);
            return;
        }

        // Space: Play/Pause Music (only if not in input)
        if (e.key === ' ' || e.code === 'Space') {
            e.preventDefault();
            const playPauseBtn = document.getElementById('playPauseBtn');
            if (playPauseBtn) {
                playPauseBtn.click();
            }
            return;
        }

        // H: Go to Home
        if (e.key.toLowerCase() === 'h') {
            window.location.href = '/';
            return;
        }

        // P: Go to Projects
        if (e.key.toLowerCase() === 'p') {
            window.location.href = '/projects.html';
            return;
        }

        // S: Go to Skills
        if (e.key.toLowerCase() === 's') {
            window.location.href = '/skills.html';
            return;
        }

        // E: Go to Experience
        if (e.key.toLowerCase() === 'e') {
            window.location.href = '/experience.html';
            return;
        }

        // C: Go to Contact
        if (e.key.toLowerCase() === 'c') {
            window.location.href = '/contact.html';
            return;
        }

        // ESC: Close all panels
        if (e.key === 'Escape') {
            closeAllPanels();
            return;
        }

        // Arrow Up: Scroll to top
        if (e.key === 'Home') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // Arrow Down: Scroll to bottom
        if (e.key === 'End') {
            e.preventDefault();
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            return;
        }
    });

    function closeAllPanels() {
        // Close AI Chat
        const aiChatContainer = document.getElementById('aiChatContainer');
        if (aiChatContainer) {
            aiChatContainer.classList.remove('active');
        }

        // Close Shortcuts Panel
        if (shortcutsPanel) {
            shortcutsPanel.classList.remove('active');
        }

        // Close Easter Egg
        const easterEgg = document.getElementById('viratEasterEgg');
        const overlay = document.getElementById('easterEggOverlay');
        if (easterEgg && overlay) {
            easterEgg.classList.remove('active');
            overlay.classList.remove('active');
        }
    }

    // Show shortcuts hint on first visit
    const hasSeenShortcuts = localStorage.getItem('hasSeenShortcuts');
    if (!hasSeenShortcuts) {
        setTimeout(() => {
            if (shortcutsPanel) {
                shortcutsPanel.classList.add('active');
                localStorage.setItem('hasSeenShortcuts', 'true');
                
                // Auto-close after 5 seconds
                setTimeout(() => {
                    shortcutsPanel.classList.remove('active');
                }, 5000);
            }
        }, 2000);
    }
});
