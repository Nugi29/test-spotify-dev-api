let token = '';

fetch('config.json')
    .then(response => response.json())
    .then(config => { token = config.API_KEY; })
    .catch(() => { alert('Spotify API key missing!'); });

let currentPlaylist = [];
let currentAudio = null;
let isPlaying = false;

async function fetchWebApi(endpoint, method, body) {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method,
        body: JSON.stringify(body)
    });
    return await res.json();
}

function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

function handleSearchEnter(event) {
    if (event.key === 'Enter') {
        searchMusic();
    }
}

async function searchMusic() {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) return;

    const loading = document.getElementById('searchLoading');
    const results = document.getElementById('searchResults');

    loading.classList.add('show');
    results.innerHTML = '';

    try {
        const searchResults = await fetchWebApi(`v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`, 'GET');
        displaySearchResults(searchResults.tracks.items);
    } catch (error) {
        console.error('Search error:', error);
        results.innerHTML = '<div style="text-align: center; padding: 20px; color: #ff6b6b;">Search failed. Please try again.</div>';
    } finally {
        loading.classList.remove('show');
    }
}

function displaySearchResults(tracks) {
    const container = document.getElementById('searchResults');

    if (!tracks || tracks.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 20px; opacity: 0.6;">No tracks found. Try a different search term.</div>';
        return;
    }

    const tracksHTML = tracks.map(track => {
        const artistNames = track.artists.map(artist => artist.name).join(', ');
        const duration = Math.floor(track.duration_ms / 60000) + ':' + String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0');
        const albumImage = track.album.images[2]?.url || '';

        return `
            <div class="track-item">
                <div class="track-cover" style="${albumImage ? `background-image: url(${albumImage}); background-size: cover;` : ''}">
                    ${!albumImage ? '🎵' : ''}
                </div>
                <div class="track-info">
                    <div class="track-name">${track.name}</div>
                    <div class="track-artist">${artistNames}</div>
                    <div class="track-duration">${duration}</div>
                </div>
                <div class="play-controls">
                    ${track.preview_url ?
                `<button class="play-button" onclick="playPreview('${track.preview_url}', '${track.name.replace(/'/g, "\\'")}', '${artistNames.replace(/'/g, "\\'")}')">▶️</button>`
                : '<button class="play-button" style="opacity: 0.5;" disabled>🚫</button>'
            }
                    <button class="add-button" onclick="addToPlaylist('${track.uri}', '${track.name.replace(/'/g, "\\'")}', '${artistNames.replace(/'/g, "\\'")}')">+</button>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = tracksHTML;
}

async function fetchTopTracks() {
    const loading = document.getElementById('topTracksLoading');
    const results = document.getElementById('topTracksResults');

    loading.classList.add('show');
    results.innerHTML = '';

    try {
        const topTracks = await fetchWebApi('v1/me/top/tracks?time_range=long_term&limit=10', 'GET');
        displaySearchResults(topTracks.items);
    } catch (error) {
        console.error('Top tracks error:', error);
        results.innerHTML = '<div style="text-align: center; padding: 20px; color: #ff6b6b;">Failed to fetch top tracks. Please try again.</div>';
    } finally {
        loading.classList.remove('show');
    }
}

function playPreview(previewUrl, trackName, artistName) {
    if (currentAudio) {
        currentAudio.pause();
    }

    currentAudio = new Audio(previewUrl);
    currentAudio.volume = document.getElementById('volumeSlider').value / 100;

    const player = document.getElementById('audioPlayer');
    const trackElement = document.getElementById('nowPlayingTrack');
    const artistElement = document.getElementById('nowPlayingArtist');
    const playBtn = document.getElementById('playPauseBtn');

    trackElement.textContent = trackName;
    artistElement.textContent = artistName;
    player.classList.add('show');

    currentAudio.play();
    isPlaying = true;
    playBtn.textContent = '⏸️';

    currentAudio.onended = () => {
        isPlaying = false;
        playBtn.textContent = '▶️';
    };
}

function togglePlayPause() {
    if (!currentAudio) return;

    const playBtn = document.getElementById('playPauseBtn');

    if (isPlaying) {
        currentAudio.pause();
        playBtn.textContent = '▶️';
        isPlaying = false;
    } else {
        currentAudio.play();
        playBtn.textContent = '⏸️';
        isPlaying = true;
    }
}

function changeVolume() {
    const volume = document.getElementById('volumeSlider').value / 100;
    if (currentAudio) {
        currentAudio.volume = volume;
    }
}

function closePlayer() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    document.getElementById('audioPlayer').classList.remove('show');
    isPlaying = false;
}

function addToPlaylist(uri, trackName, artistName) {
    const track = { uri, name: trackName, artist: artistName };

    // Check if track already exists
    if (currentPlaylist.find(t => t.uri === uri)) {
        alert('Track already in playlist!');
        return;
    }

    currentPlaylist.push(track);
    updatePlaylistDisplay();

    // Show success message
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = '✓';
    button.style.background = '#28a745';
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
    }, 1000);
}

function removeFromPlaylist(uri) {
    currentPlaylist = currentPlaylist.filter(track => track.uri !== uri);
    updatePlaylistDisplay();
}

function updatePlaylistDisplay() {
    const container = document.getElementById('currentPlaylist');

    if (currentPlaylist.length === 0) {
        container.innerHTML = '<p style="text-align: center; opacity: 0.6; padding: 40px;">No tracks added yet. Search and add some music!</p>';
        return;
    }

    const playlistHTML = currentPlaylist.map((track, index) => `
        <div class="playlist-track">
            <div>
                <div style="font-weight: bold; color: #1ed760;">${index + 1}. ${track.name}</div>
                <div style="opacity: 0.8; font-size: 0.9rem;">by ${track.artist}</div>
            </div>
            <button class="remove-button" onclick="removeFromPlaylist('${track.uri}')">×</button>
        </div>
    `).join('');

    container.innerHTML = playlistHTML;
}

async function createPlaylistOnSpotify() {
    if (currentPlaylist.length === 0) {
        alert('Please add some tracks to your playlist first!');
        return;
    }

    try {
        const { id: user_id } = await fetchWebApi('v1/me', 'GET');

        const playlist = await fetchWebApi(`v1/users/${user_id}/playlists`, 'POST', {
            "name": "My Custom Playlist",
            "description": "Created with Spotify Music Hub",
            "public": false
        });

        const trackUris = currentPlaylist.map(track => track.uri);
        await fetchWebApi(`v1/playlists/${playlist.id}/tracks?uris=${trackUris.join(',')}`, 'POST');

        // Show the embedded playlist
        const embedContainer = document.getElementById('embedContainer');
        const spotifyEmbed = document.getElementById('spotifyEmbed');

        embedContainer.innerHTML = `
            <iframe 
                src="https://open.spotify.com/embed/playlist/${playlist.id}?utm_source=generator&theme=0" 
                width="100%" 
                height="400" 
                frameborder="0" 
                allowfullscreen="" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"
                style="border-radius: 15px;">
            </iframe>
        `;

        spotifyEmbed.style.display = 'block';

        alert(`Playlist "${playlist.name}" created successfully on Spotify!`);

    } catch (error) {
        console.error('Playlist creation error:', error);
        alert('Failed to create playlist. Please check your Spotify permissions.');
    }
}
