let currentSong = new Audio();
const play = document.getElementById("play");
let currfolder
let songs
async function getSongs(folder) {
    currfolder = folder
    let a = await fetch(`http://127.0.0.1:3000/${currfolder}/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href)
        }
    }

    // Show all the songs in the playlist

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        // `song` is the full href; compute a cleaned display title and store href in data-src
        let displayTitle = song
        try {
            const raw = new URL(song).pathname.split('/').pop() || ''
            displayTitle = decodeURIComponent(raw).replace(/\.mp3$/i, '').replace(/[-_]+/g, ' ')
        } catch (err) {
            displayTitle = song.replace(/\.mp3$/i, '')
        }

        songUL.innerHTML = songUL.innerHTML + `<li data-src="${song}"><img class="invert" src="/img/music.svg" alt="">
                            <div class="info">
                                <div>${displayTitle}</div>
                                <div>Shaan</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div></li>`
    }

    // Attach an event listener to each song

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            const trackUrl = e.getAttribute('data-src')
            console.log('Playing track URL:', trackUrl)
            if (trackUrl) playMusic(trackUrl)
        })
    })
}

const playMusic = (track, pause = false) => {

    currentSong.src = track
    if (!pause) {
        currentSong.play()
        play.src = "img/pause.svg"
    }
    const infoEl = document.querySelector(".songinfo")
    if (infoEl) {
        try {
            const raw = new URL(track).pathname.split('/').pop() || ''
            infoEl.textContent = decodeURIComponent(raw).replace(/\.mp3$/i, '').replace(/[-_]+/g, ' ')
        } catch (err) {
            infoEl.textContent = track
        }
    }
    const timeEl = document.querySelector(".songtime")
    if (timeEl) timeEl.textContent = "0:00"

    currentSong.ontimeupdate = () => {
        const t = currentSong.currentTime || 0
        const mins = Math.floor(t / 60)
        const secs = Math.floor(t % 60).toString().padStart(2, '0')
        const te = document.querySelector(".songtime")
        if (te) te.textContent = `${mins}:${secs}`
        document.querySelector(".circle").style.left = `${(t / currentSong.duration || 0) * 100}%`
    }

    // Add an event listener to the seek bar to allow seeking within the song
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const clickX = e.clientX - rect.left
        const seekTime = (clickX / rect.width) * currentSong.duration
        currentSong.currentTime = seekTime
    })
}

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:3000/songs/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs")) {
            let folder = e.href.split("/").slice(-2)[0];
            // Get the metadata of the folder
            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
            let response = await a.json()
            console.log(response);
            cardContainer.innerHTML += `<div data-folder="cs" class="card">
                        <div class="play">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="#000"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" stroke-width="1.5"
                                    stroke-linejoin="round" />
                            </svg>
                        </div>
                        <img src="/songs/${folder}/cover.jpg"
                            alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
        }
    }
}

    async function main() {

        //Get the list of all the songs

        await getSongs("songs/ncs")
        playMusic(songs[0], true) // Preload the first song without playing it

        // Display all the albums on the page

        displayAlbums()

        // Attach event listeners to the play, next and previous buttons

        play.addEventListener("click", () => {
            if (currentSong.paused) {
                currentSong.play()
                play.src = "img/pause.svg"
            } else {
                currentSong.pause()
                play.src = "img/play.svg"
            }
        })

        // Add event listener for hamburger menu toggle
        document.querySelector(".hamburger").addEventListener("click", () => {
            document.querySelector(".left").style.left = "0"
        })

        // Add event listener for close button in the sidebar
        document.querySelector(".close").addEventListener("click", () => {
            document.querySelector(".left").style.left = "-120%"
        })

        // Add event listeners for next and previous buttons

        previous.addEventListener("click", () => {
            let currentIndex = songs.indexOf(currentSong.src)
            if (currentIndex > 0) {
                playMusic(songs[currentIndex - 1])
            }
        })

        next.addEventListener("click", () => {
            let currentIndex = songs.indexOf(currentSong.src)
            if (currentIndex < songs.length - 1) {
                playMusic(songs[currentIndex + 1])
            }
        })

        // Add event listener for volume control
        document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("input", (e) => {
            currentSong.volume = e.currentTarget.value / 100
        })

        // Load the playlist whenever card is clicked
        Array.from(document.getElementsByClassName("card")).forEach(e => {
            e.addEventListener("click", async item => {
                await getSongs(`songs/${item.currentTarget.dataset.folder}`)
                // Automatically play the first song of the newly loaded playlist
                if (songs.length > 0) {
                    playMusic(songs[0])
                }
            })
        })

        // Add event listener to mute the track when the volume icon is clicked

        document.querySelector(".volume>img").addEventListener("click", e=> {
            console.log(e.target);
            if (e.target.src.includes("volume.svg")) {
                currentSong.volume = 0
                e.target.src = e.target.src.replace("volume.svg", "mute.svg")
                document.querySelector(".range").getElementsByTagName("input")[0].value = 0
            } else {
                currentSong.volume = 0.1
                e.target.src = e.target.src.replace("mute.svg", "volume.svg")
                document.querySelector(".range").getElementsByTagName("input")[0].value = 10
            }
        })        
    }

    main()