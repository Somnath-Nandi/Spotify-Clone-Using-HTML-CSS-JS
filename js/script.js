console.log("Script.js Initializing...");

async function getSongs() {

    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("http://127.0.0.1:3000/%")[1])
        }
    }
    return songs
}

async function main() {

    let currentSong;


    //Get the list of all the songs

    let songs = await getSongs()
    console.log(songs);

    // Show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="/img/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ").replaceAll("5Csongs%5C", " ").replaceAll(".mp3", " ").replaceAll("%EF%BD%9C", " ").replaceAll("-", " ").replaceAll("456461", " ").replaceAll("456462", " ").replaceAll("456466", " ").replaceAll("456887", " ").replaceAll("456465", " ").replaceAll("Ranveer Singh, Shashwat Sachdev, Hanumankind, Jasmine Sandlas,Aditya Dhar", " ").replaceAll("for video 33 sec 453304", "")}</div>
                                <div>Shaan</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div></li>`
    }

    // Attach an event listener to each song

    // Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=> {
    //     console.log(e.target.getElementsByTagName("div")[0]);
    // }) Incomplete Code Here

}

main()