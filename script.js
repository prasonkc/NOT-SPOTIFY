const fetchURL = "http://127.0.0.1:3000/songs"
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
        let song = i.split("/songs/")[1].replaceAll("%20", " ").replaceAll("_", " ")
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

function listenForLibClicks(songs){
    let libPlayBtns = document.querySelectorAll(".lib-play-btn");
    let currentlyPlaying;

    for (let i = 0; i < libPlayBtns.length; i++) {
        let clickedAudio = new Audio(songs[i]);
        let button = libPlayBtns[i];
        button.addEventListener("click", (e) => {
            if(currentlyPlaying && currentlyPlaying != clickedAudio){
                currentlyPlaying.pause();
            }
            clickedAudio.play()
            currentlyPlaying = clickedAudio;
        })
    }
}


async function main(){
    let songs = await getSongs();
    await addSongsToLibrary(songs);

    //listen for click on left library
    listenForLibClicks(songs);

    //listen for playlist clicks

    //listen for controls
    

    // console.log(songs)

}

main()