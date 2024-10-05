console.log("hello there")

let currentSong = new Audio();

let currentFolder;

let currsongs;

let mplay;

function formatTime(seconds) {
    // Ensure the input is a non-negative integer
    if (seconds < 0) {
        return "00:00";
    }

    // Calculate minutes and seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60); // Use Math.floor to get integer seconds

    // Format minutes and seconds with leading zeros
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0'); // Ensure seconds are two digits

    return `${formattedMinutes}.${formattedSeconds}`;
}

//get songs
async function getsongs(folder) {
    try {
        currentFolder = folder;
        let a = await fetch(`https://github.com/techshadow01/spotify/${folder}`)
        let response = await a.text();
        let div = document.createElement("div");
        div.innerHTML = response;

        // extract anchor tags
        let as = div.getElementsByTagName("a")


        let songs = []
        for (let index = 0; index < as.length; index++) {
            const element = as[index];
            if (element.href.endsWith(".mp3")) {
                songs.push(element.href.split(`/${folder}`)[1])
            }
        }

        currsongs = songs;
        console.log(currsongs)

        //songlist
        let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0]
        songUl.innerHTML = "";
        for (const song of songs) {
            songUl.innerHTML = songUl.innerHTML + ` <li>
                     <div>
                         <span class="invert"><img src="assets/music.svg" alt=""></span>
                         <div>${song.replaceAll("%20", " ")}</div>
                     </div>
                     <span class="invert music1"><img src="assets/music1.svg" alt=""></span>
                 </li> `;
        }

        //connect each song in library
        Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
            e.addEventListener("click", element => {

                cname = currentSong.src.split("/")[8].replaceAll("%20", " ");
                lname = e.getElementsByTagName("div")[0].getElementsByTagName("div")[0].innerHTML;
                // console.log(cname, lname)


                if (cname == lname && currentSong.currentTime != 0) {
                    if (currentSong.paused) {
                        currentSong.play();
                        play.src = "assets/pause.svg"
                        mplay.src = "assets/pause2.svg"
                    }
                    else {
                        currentSong.pause();
                        play.src = "assets/play.svg"
                        mplay.src = "assets/music1.svg"
                    }
                }
                else {
                    playMusic(e.getElementsByTagName("div")[0].getElementsByTagName("div")[0].innerHTML.trim());
                }
            })
        })

        return songs;

    } catch (error) {
        console.error("error")
    }
}

async function Playlists() {
    let a = await fetch(`http://127.0.0.1:5500/web/cwh/spotify/songs/`)
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");

    Array.from(as).forEach(async e => {
        if (e.href.includes("songs/")) {
            // console.log(e.href.split("songs/")[1]);
            let folder = e.href.split("songs/")[1];

            let a = await fetch(`https://github.com/techshadow01/spotify/songs/${folder}/info.json`)
            let response = await a.json();
            // console.log(response);

            let card = document.querySelector(".right_sec2");

            card.innerHTML = card.innerHTML + ` <div data-folder="${folder}" class="rightsec2box">
                <div class="playbtn">
                    <svg data-encore-id="icon" width="20px" role="img" aria-hidden="true" viewBox="0 0 24 24"
                        class="Svg-sc-ytk21e-0 bneLcE">
                        <path
                            d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z">
                        </path>
                    </svg>
                </div>
                <div><img src="./songs/${folder}/cover.png" alt=""></div>
                <div>${response.title}</div>
                <div>${response.desc}</div>
            </div>`

            //event for card
            Array.from(document.getElementsByClassName("rightsec2box")).forEach(e => {
                // console.log(e)
                e.addEventListener("click", async item => {
                    // console.log(item.currentTarget.dataset)
                    await getsongs(`songs/${item.currentTarget.dataset.folder}/`)
                    // console.log(songs)

                    document.querySelector(".left").style.left = 0 + "%"
                })
            })
        }
    })
}

//current song control
const playMusic = (track) => {

    currentSong.src = `${currentFolder}` + track
    currentSong.play();
    play.src = "assets/pause.svg"

    songInfo.innerHTML = track.replaceAll("%20", " ");
    songTime.innerHTML = "00:00 / 00:00"

    let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0]


    Array.from(songUl.getElementsByTagName("li")).forEach(e => {

        // console.log(e.getElementsByTagName("div")[0].getElementsByTagName("div")[0].innerHTML)
        // console.log(currentSong.src.split(`${currentFolder}`)[1].replaceAll("%20", " "))

        let lsong = e.getElementsByTagName("div")[0].getElementsByTagName("div")[0].innerHTML;
        let csong = currentSong.src.split(`${currentFolder}`)[1].replaceAll("%20", " ");

        if (lsong == csong) {
            e.getElementsByClassName("music1")[0].getElementsByTagName("img")[0].src = "assets/pause2.svg";
            mplay = e.getElementsByClassName("music1")[0].getElementsByTagName("img")[0];
            // console.log(mplay)
        }
        else {
            e.getElementsByClassName("music1")[0].getElementsByTagName("img")[0].src = "assets/music1.svg";
        }
    })

}

async function main() {
    await getsongs("songs/song1/")
    // console.log(songs)

    Playlists()

    //insert first song at start
    currentSong.src = `${currentFolder}` + currsongs[0];
    songInfo.innerHTML = currsongs[0].replaceAll("%20", " ");



    //  play/pause
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "assets/pause.svg"
            mplay.src = "assets/pause2.svg"
            //console.log(mplay)
        }
        else {
            currentSong.pause();
            play.src = "assets/play.svg"
            mplay.src = "assets/music1.svg"
        }
    })

    //songtime
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration)
        songTime.innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`
        Circle.style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
        proBar.style.width = (currentSong.currentTime / currentSong.duration) * 100 + "%"

        //autoplay
        if (currentSong.currentTime == currentSong.duration) {
            let index = currsongs.indexOf(currentSong.src.split("songs/")[1]);
            playMusic(currsongs[index + 1])
        }
    })

    //seekbar
    seekbar.addEventListener("click", e => {
        let newSet = (e.offsetX / seekbar.getBoundingClientRect().width) * 100;
        // console.log(seekbar.offsetX, e.target, seekbar.getBoundingClientRect().width, newSet)
        Circle.style.left = newSet + "%";
        // proBar.style.width = newSet + "%";
        currentSong.currentTime = (newSet * currentSong.duration) / 100;
    })

    //menu show (click)
    document.querySelector(".right_top3").addEventListener("click", e => {
        //console.log(e)
        document.querySelector(".left").style.left = 0 + "%"
        //document.querySelector(".right").style.filter = `blur(${1}px)`
    })

    //menu hide (click)
    right_top1.addEventListener("click", e => {
        //console.log(e)
        document.querySelector(".left").style.left = -100 + "%"
        //document.querySelector(".right").style.filter = `blur(${0}px)`
    })

    //next
    next.addEventListener("click", e => {
        //console.log(currsongs.indexOf(currentSong.src.split("songs/")[1]))
        let index = currsongs.indexOf(currentSong.src.split(`${currentFolder}`)[1]);
        if (index < currsongs.length - 1) {
            playMusic(currsongs[index + 1])
        }
        else {
            playMusic(currsongs[0])
        }

    })

    //previous
    previous.addEventListener("click", e => {
        //console.log(songs.indexOf(currentSong.src.split("songs/")[1]))
        let index = currsongs.indexOf(currentSong.src.split(`${currentFolder}`)[1]);
        if (index == 0) {
            playMusic(currsongs[currsongs.length - 1])
        }
        else {
            playMusic(currsongs[index - 1])
        }
    })

}

main()    
