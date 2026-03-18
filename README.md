# Spotify Clone (Web)

A lightweight Spotify-like web music player built using HTML, CSS, and JavaScript. This project demonstrates how to build a simple music streaming UI that:

- Lists album playlists (folders) and displays them as clickable cards
- Fetches available `.mp3` tracks from a local `songs/` folder via a directory listing
- Plays tracks with play/pause, next/prev, seek bar, and volume controls
- Loads album metadata from `info.json` files (for title/description)

> ⚠️ This project requires running from a local web server (not `file://`) because it fetches directory listings via `fetch()`.

---

## ✅ Features

- 🎵 Play/pause a selected song
- ⏭ Next / Previous track navigation
- 🎧 Seek bar (click to jump within the track)
- 🔊 Volume slider + mute/unmute toggle
- 📁 Albums loaded from `songs/` directory structure
- 🧾 Album metadata support via `info.json`

---

## 🚀 Getting Started (Run Locally)

### 1) Start a local web server

You must serve the files over HTTP so the player can fetch directory listings.

**Option A: Python (recommended)**

```bash
cd "d:/Web Dev Course/Spotify Clone"
python -m http.server 3000
```

Then open:

```
http://127.0.0.1:3000/
```

**Option B: VS Code Live Server extension**

Install Live Server and click **Go Live**.


### 2) Open the app

Open the browser at:

```
http://127.0.0.1:3000/
```

---

## 📁 Project Structure

```
index.html              # Main UI layout
js/script.js            # Player logic + album/song fetch + playback controls
Css/style.css           # Styling for the app
Css/utility.css         # Utility classes
img/                    # Icons and cover images
songs/                  # Album folders + mp3 files
  ├─ cs/                # “Copyright Songs” album
  │   ├─ info.json      # Album metadata (title + description)
  │   ├─ cover.jpg      # Album cover
  │   └─ *.mp3          # Songs
  └─ ncs/               # “No Copyright Songs” album
      ├─ info.json
      ├─ cover.jpg
      └─ *.mp3
```

---

## 🛠️ How It Works (High Level)

### 1) Loading Albums
The app fetches `http://127.0.0.1:3000/songs/` and parses the directory listing HTML to find folder links.

Each folder is expected to have an `info.json` file with metadata:

```json
{
  "title": "Album Title",
  "description": "Album description"
}
```

If `info.json` exists, its title/description are used for the album card.


### 2) Loading Songs
When an album card is clicked, the app fetches the album folder’s directory listing, finds `.mp3` files, and renders them into the playlist.

Clicking a track will start playback.


### 3) Playback Controls
- Play/pause button toggles playback
- Next/previous buttons advance through the current playlist
- Seek bar lets the user jump to a specific time in the track
- Volume slider adjusts audio volume
- Clicking the volume icon toggles mute/unmute

---

## ➕ Adding New Albums / Songs

1. Create a new folder under `songs/`, e.g. `songs/my-album`
2. Add a `cover.jpg` (used on the album card)
3. Add an `info.json` (optional but recommended):

```json
{
  "title": "My Album Name",
  "description": "A short description"
}
```

4. Drop your `.mp3` files into the folder.

5. Refresh the browser — the new album should appear.

---

## ⚠️ Known Limitations

- The app assumes the backend returns an HTML directory listing (e.g., from Python’s `http.server`). It won’t work with servers that don’t expose the directory listing.
- Browsers block `fetch()` for `file://` URLs, so you must run a local server.
- Albums without `info.json` are still shown, but with fallback titles & descriptions.

---