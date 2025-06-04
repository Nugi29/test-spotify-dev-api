# Nugi Music Hub - Test Spotify Web API

A beautiful web app to search, play, and create custom playlists using the Spotify Web API.

## Features

- **Search Music:** Find songs, artists, or albums from Spotify's vast library.
- **Top Tracks:** View your top tracks from your Spotify account.
- **Custom Playlist:** Add tracks to your own playlist and remove them as needed.
- **Create on Spotify:** Instantly create a new playlist in your Spotify account with your selected tracks.
- **Modern UI:** Responsive, modern, and visually appealing design.

## Getting Started

### Prerequisites
- A Spotify Developer account ([Spotify Developer Dashboard](https://developer.spotify.com/dashboard/))
- A Spotify API access token (OAuth)
- Modern web browser

### Setup
1. **Clone this repository:**
   ```
   git clone https://github.com/yourusername/nugi-music-hub.git
   cd nugi-music-hub
   ```
2. **Configure your Spotify API token:**
   - Copy `config.json` and add your Spotify API token:
     ```json
     {
       "API_KEY": "YOUR_SPOTIFY_TOKEN_HERE"
     }
     ```
   - **Do NOT commit your real token to GitHub!**
   - `config.json` is in `.gitignore` for your safety.

3. **Open `index.html` in your browser.**

### Usage
- Use the search bar to find music.
- Click + to add a track to your playlist.
- Go to the Playlist tab to view and manage your playlist.
- Click "Create on Spotify" to save your playlist to your Spotify account.
- Click ▶️ to play a preview.

## Security Note
- **Never expose your Spotify API token in public repositories.**
- This project is for testing and educational purposes only.
- For production, implement a backend to securely handle authentication and API requests.

## Technologies Used
- HTML, CSS, JavaScript (Vanilla)
- Spotify Web API

## License

This project is for educational/testing purposes. See [Spotify Developer Terms](https://developer.spotify.com/terms/).

---
⭐️ From [Nugi29](https://github.com/Nugi29)
