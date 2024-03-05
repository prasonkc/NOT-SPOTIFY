const fetchURL = "http://127.0.0.1:3000/songs/";

let songs = [];
async function getSongs(){
    let apiCall = await fetch(fetchURL);
    let htmlString = await apiCall.text();

    const parser = new DOMParser();   //This object allows you to convert HTML strings into structured DOM representation and lets you work with HTML elements as if they were on a real webpage
    const doc = parser.parseFromString(htmlString, 'text/html');

    let allATags = doc.getElementsByTagName("a");
    for (const a of allATags) {
        if(a.href.endsWith(".mp3")){
            songs.push(a.href)
        }
    }
    return songs;
}

async function addSongsToLibrary(){
    let songLibrary = document.querySelector(".songlibrary")
    for (const i of songs) {
        let song = (i.split("/songs/")[1].replaceAll("%20", "").replaceAll("_", " ")).split(".mp3")[0]
        songLibrary.innerHTML +=  `<li>
                                    <div class="info flex items-center justify-center gap10">
                                        <img src="./icons/music-icon.svg" alt="" srcset="" class="invert">
                                        <p>${song}</p>
                                    </div>
                                    <div class="lib-play-btn flex items-center justify-center">
                                        <img src="./icons/play.svg" alt="" srcset="" class="invert">
                                    </div>
                                    </li>`;
    }
}


let audio = new Audio()

function listenForLibClicks(){
    let libPlayBtns = document.querySelector(".songlibrary").getElementsByTagName("li");
    let playBtn = document.getElementById("play-button");

    let songName = document.getElementById("song-info");
    
    Array.from(libPlayBtns).forEach(button => {
        button.addEventListener("click", () => {
            audio.src = (fetchURL + button.querySelector("div").querySelector("p").innerText).replaceAll(" ", "_") + ".mp3"
            audio.play();
            playBtn.src = "/icons/pause.svg";
            songName.innerText = button.querySelector("div").querySelector("p").innerText
        })
    });

    listenForControls()
}

function listenForControls(){
    let playBtn = document.getElementById("play-button");
    let next = document.getElementById("next-button");
    let prev = document.getElementById("prev-button");
    let volume = document.getElementById("vol-range");
    let songName = document.getElementById("song-info");

    
    playBtn.addEventListener("click", () => {
        document.querySelector(".circle").style.opacity = 1;
        if(audio.src == ""){
            audio.src = songs[0]
            songName.innerText = (songs[0].split("/songs/")[1].replaceAll("%20", "").replaceAll("_", " ")).split(".mp3")[0]
        }
        if(audio.paused){
            audio.play()
            playBtn.src = "/icons/pause.svg"
        }
        else{
            audio.pause()
            playBtn.src = "/icons/play.svg"
        }
    })

    next.addEventListener("click", (e) => {
        let index = (songs.indexOf((audio.src)));
        audio.pause()
        
        if(index < songs.length){
            audio.src = songs[index + 1]
            songName.innerText = (songs[index + 1].split("/songs/")[1].replaceAll("%20", "").replaceAll("_", " ")).split(".mp3")[0]
            audio.play()
        }
    })

    prev.addEventListener("click", (e) => {
        let index = (songs.indexOf((audio.src)));
        audio.pause()
        
        if(index > 0){
            audio.src = songs[index + 1]
            songName.innerText = (songs[index + 1].split("/songs/")[1].replaceAll("%20", "").replaceAll("_", " ")).split(".mp3")[0]
            audio.play()
        }
    })

    volume.onchange = () => {
        audio.volume = parseInt(volume.value)/100;
    } 
}

function hamburgerAnimation(){
    let hamburger = document.querySelector(".hamburger")
    let left = document.querySelector(".left")
    let close = document.querySelector(".close")
    let right = document.querySelector(".right");
    hamburger.addEventListener("click", (e) => {
        left.style.display = "block";
        hamburger.style.display = "none";
        close.style.display = "block";
        right.style.display = "none";
    })

    close.addEventListener("click", (e) => {
        left.style.display = "none";
        hamburger.style.display = "block";
        right.style.display = "block";
    })
}

async function main(){
    await getSongs();
    await addSongsToLibrary();

    //listen for click on left library
    listenForLibClicks();

    audio.addEventListener("timeupdate", () => {
        const songTime = document.getElementById("song-duration");
        songTime.textContent = secondsToTime(audio.currentTime) + " / " + secondsToTime(audio.duration);
        document.querySelector(".circle").style.left = 1 + (audio.currentTime/audio.duration) * 72 + "%";

    });

    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percentage = (e.offsetX/ e.target.getBoundingClientRect().width) * 100;

        let circleSeek = (e.offsetX/ e.target.getBoundingClientRect().width) * 72;
        document.querySelector(".circle").style.left = 1 + circleSeek + "%";

        audio.currentTime = (audio.duration * percentage)/100;

    })

    hamburgerAnimation()

    //listen for playlist clicks

    //listen for controls

    // console.log(songs)

}

main()





function secondsToTime(seconds) {
    // Ensure input is a number
    if (typeof seconds !== 'number' || isNaN(seconds)) {
      throw new Error('Input must be a number');
    }
  
    // Calculate minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
  
    // Format the output string with two-digit seconds
     return (`${minutes}:${remainingSeconds.toString().padStart(2, '0')}`);
  }
  