// Music Player functionality
document.addEventListener('DOMContentLoaded', () => {
    const audioPlayer = document.getElementById('audioPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const musicPlayer = document.getElementById('musicPlayer');
    const musicCloseBtn = document.getElementById('musicCloseBtn');

    // Playlist with Dhurandhhar title track and other Indian tracks
    const playlist = [
        {
            title: "Dhurandhhar Title Track",
            artist: "Original Soundtrack",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" // Placeholder - replace with actual track
        },
        {
            title: "Epic Cinematic Theme",
            artist: "Soundtrack",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
        },
        {
            title: "Upbeat Energy Track",
            artist: "Background Score",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
        }
    ];

    let currentTrackIndex = 0;
    let isPlaying = false;

    // Initialize
    if (audioPlayer) {
        loadTrack(currentTrackIndex);
        audioPlayer.volume = 0.7;
    }

    function loadTrack(index) {
        if (index < 0 || index >= playlist.length) return;
        
        currentTrackIndex = index;
        const track = playlist[currentTrackIndex];
        
        audioPlayer.src = track.url;
        updateTrackInfo(track);
    }

    function updateTrackInfo(track) {
        const titleElement = document.querySelector('.music-title');
        const artistElement = document.querySelector('.music-artist');
        
        if (titleElement) titleElement.textContent = track.title;
        if (artistElement) artistElement.textContent = track.artist;
    }

    function togglePlayPause() {
        if (isPlaying) {
            audioPlayer.pause();
            isPlaying = false;
            playPauseBtn.classList.remove('playing');
        } else {
            audioPlayer.play().catch(err => {
                console.log('Playback prevented:', err);
                // Show a notification that user needs to interact first
                showNotification('Click play to start music');
            });
            isPlaying = true;
            playPauseBtn.classList.add('playing');
        }
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'music-notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    // Play/Pause button
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', togglePlayPause);
    }

    // Previous track
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            let newIndex = currentTrackIndex - 1;
            if (newIndex < 0) newIndex = playlist.length - 1;
            loadTrack(newIndex);
            if (isPlaying) {
                audioPlayer.play();
            }
        });
    }

    // Next track
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            let newIndex = currentTrackIndex + 1;
            if (newIndex >= playlist.length) newIndex = 0;
            loadTrack(newIndex);
            if (isPlaying) {
                audioPlayer.play();
            }
        });
    }

    // Volume control
    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            audioPlayer.volume = e.target.value / 100;
        });
    }

    // Close/minimize player
    if (musicCloseBtn) {
        musicCloseBtn.addEventListener('click', () => {
            musicPlayer.classList.add('minimized');
        });
    }

    // Auto-play next track when current ends
    if (audioPlayer) {
        audioPlayer.addEventListener('ended', () => {
            let newIndex = currentTrackIndex + 1;
            if (newIndex >= playlist.length) newIndex = 0;
            loadTrack(newIndex);
            if (isPlaying) {
                audioPlayer.play();
            }
        });

        // Update play state
        audioPlayer.addEventListener('play', () => {
            isPlaying = true;
            playPauseBtn.classList.add('playing');
        });

        audioPlayer.addEventListener('pause', () => {
            isPlaying = false;
            playPauseBtn.classList.remove('playing');
        });
    }

    // Show music player on page load
    if (musicPlayer) {
        setTimeout(() => {
            musicPlayer.classList.add('visible');
        }, 1500);
    }

    // Restore volume from localStorage
    const savedVolume = localStorage.getItem('musicVolume');
    if (savedVolume && volumeSlider) {
        volumeSlider.value = savedVolume;
        audioPlayer.volume = savedVolume / 100;
    }

    // Save volume on change
    if (volumeSlider) {
        volumeSlider.addEventListener('change', (e) => {
            localStorage.setItem('musicVolume', e.target.value);
        });
    }
});
