const fetchURL = "http://127.0.0.1:3000/songs/";

async function getSongs(){
    let songs = [];
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

async function addSongsToLibrary(songs){
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
    let playBtn = document.getElementById("play-button")
    
    playBtn.addEventListener("click", () => {
        if(audio.paused){
            audio.play()
            playBtn.src = "/icons/pause.svg"
        }
        else{
            audio.pause()
            playBtn.src = "/icons/play.svg"
        }
    })
}

async function main(){
    let songs = await getSongs();
    await addSongsToLibrary(songs);

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
  