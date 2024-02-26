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

async function main(){
    let songs = await getSongs();

    //dummy test lol
    let audio = new Audio(songs[0]);
    document.getElementById("play-button").addEventListener("click", (e) =>{
        audio.play();
    })

    console.log(songs)
}

main()