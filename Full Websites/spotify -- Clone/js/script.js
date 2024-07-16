/** FUNCTION EXPLAINATION -- updateUI();

 * Updates the song list in the UI and adds click event listeners to each song.
 * 
 * This function addresses two main issues:
 * 1. Ensures the song list is updated whenever new songs are loaded,
 *    either on initial page load or when a new playlist is selected.
 * 2. Reattaches click event listeners to the newly created song list items,
 *    allowing users to play songs by clicking on them.
 * 
 * By centralizing this logic in a separate function:
 * - We avoid code duplication
 * - We ensure consistent updating of the UI
 * - We make the code more maintainable and easier to modify in the future
 * 
 * This function should be called:
 * - In the main() function after initially loading songs
 * - Whenever a new playlist is loaded (e.g., when a card is clicked)
 */
function updateUI() {
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                            <img class="invert" src="/images/music.svg" alt="music_icon">
                            <div class="info">

                                <div class="songInfo">
                                    <div>${song.replaceAll("%20", " ").replaceAll("undefined", " ")}</div>
                                    <div>Nirmit</div>
                                </div>
                                <div class="playNowbtn">
                                    <span>Play Now</span>
                                    <img class="invert" src="/images/play.svg" alt="PlayButton">
                                </div>
                            </div>
                        </li>`;
        
    }

    //event Litner for playing song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".songInfo").getElementsByTagName("div")[0].innerHTML);
            playMusic(e.querySelector(".songInfo").getElementsByTagName("div")[0].innerHTML);

        })
    })
}
function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00"
    }
    // Ensure we are working with an integer number of seconds
    const totalSeconds = Math.floor(seconds);

    // Calculate minutes and remaining seconds
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;

    // Pad minutes and seconds with leading zeros if necessary
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(remainingSeconds).padStart(2, '0');

    // Return formatted time
    return `${paddedMinutes}:${paddedSeconds}`;
}

function attachCardClickEvents() {
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            updateUI();
            if (songs.length > 0) {
                playMusic(songs[0], true); // Pass true to pause the music
                updatePlayButton(true); // Update button to show play icon
            }
        });
    });
}




let currentSong = new Audio();
let songs;
let currentFloder;

async function getSongs(folder) {

    try {

        currentFloder = folder;
        let a = await fetch(`/${folder}/`)
        let response = await a.text();

        let div = document.createElement("div")
        div.innerHTML = response;

        let as = div.getElementsByTagName("a")
        let songs = []
        // for (let index = 0; index < as.length; index++) {
        //     const element = as[index];
        //     if (element.href.endsWith(".mp3")) {
        //         songs.push(element.href);
        //     }
        // }

        // for (const element of as) {
        //     if (element.href.endsWith(".mp3")) {
        //         songs.push(element.href);
        //     }
        // }

        Array.from(as).forEach(element => {
            if (element.href.endsWith(".mp3")) {
                songs.push(element.href.split(`/${folder}/`)[1]);
            }
        })
        return songs;

    } catch (error) {
        console.log("Fetch Error", error);
    }
}

const playMusic = (track, pause = false) => {
    currentSong.src = `/${currentFloder}/` + track;
    if (!pause) {
        currentSong.play();
        updatePlayButton(false); // false means not paused
    } else {
        currentSong.pause();
        updatePlayButton(true); // true means paused
    }
    document.querySelector(".printInfo").innerHTML = decodeURI(track);
    document.querySelector(".printDuration").innerHTML = "00:00/00:00";
}

function updatePlayButton(paused) {
    const playButton = document.getElementById("play"); // Assuming your play button has id="play"
    document.querySelector(".circle").style.left = "0";
    if (paused) {
        playButton.src = "/images/play.svg";
    } else {
        playButton.src = "/images/pause.svg";
    }
}

async function displayAlbums() {
    let a = await fetch(`/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;

    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer");
    cardContainer.innerHTML = ''; // Clear existing content

    for (let e of anchors) {
        if (e.href.includes("/songs/") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").splice(4)[0];
            let a = await fetch(`/songs/${folder}/info.json`);
            let response = await a.json();

            cardContainer.innerHTML += `<div data-folder="${folder}" class="card">
                        <div class="playbtn">
                            <svg height="48px" width="200px" version="1.1" xmlns="http://www.w3.org/2000/svg"
                                xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 60 60" xml:space="preserve">
                                <circle cx="30" cy="30" r="30" fill="#1EDB62" />
                                <polygon points="23,15 45,30 23,45" fill="black" />
                            </svg>
                        </div>
                        <figure>
                            <img src="/songs/${folder}/cover.jpeg" alt="Image">
                        </figure>
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`;
        }
    }
    attachCardClickEvents(); // Attach click events after rendering

}

async function main() {

    //get songs using fetch API
    songs = await getSongs("songs/ncs");
    playMusic(songs[0], true)

    displayAlbums();

    updateUI();

    //event Litner for playing song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".songInfo").getElementsByTagName("div")[0].innerHTML);
            playMusic(e.querySelector(".songInfo").getElementsByTagName("div")[0].innerHTML);

        })
    })

    //event listner for Play,nexr and previous song
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            updatePlayButton(false);
        } else {
            currentSong.pause()
            updatePlayButton(true);
        }
    })

    //Time updater
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".printDuration").innerHTML = `
    ${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
        document.querySelector(".circle").style.left = ((currentSong.currentTime / currentSong.duration) * 100) + "%"
    })

    // ADD event listner to seekbar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    })

    // ADD wheb hamburger is clicked

    document.querySelector(".Hambuger").addEventListener("click", () => {
        document.querySelector(".leftside").style.left = "0";
    })

    //Add eventlistner to function cross
    document.querySelector(".cross").addEventListener("click", () => {
        document.querySelector(".leftside").style.left = "-100%";
    })

    //ADD eventlistner for previous button
    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    //ADD eventlistner for next button
    next.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    //Load the playlist when card is clicked

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            updateUI();
            if (songs.length > 0) {
                playMusic(songs[0], true)
            }

        })
    })
}

main();