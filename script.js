console.log("lets write javascript")
let currentSong = new Audio()
let songs;
let currFolder


function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder){
    currFolder=folder;
let a= await fetch(`http://127.0.0.1:5500/songs/${currFolder}/`);
let response= await a.text();

let div=document.createElement("div")
div.innerHTML=response
let lis=div.getElementsByTagName("a")


songs=[]

for(let index=0;index<lis.length;index++){
    const element=lis[index]
    
    if(element.href.endsWith(".mp3")){
        songs.push(element.href.split(`/${currFolder}/`)[1])
    }
}

let songul=document.querySelector(".songlist").getElementsByTagName("ul")[0]

songul.innerHTML=``
for (const song  of songs) {

    songul.innerHTML=songul.innerHTML+`<li>
                        <img class="invert" src="music.svg" alt="">
                        <div class="info">
                            <div>${song.replaceAll("%20", " ")}</div>
                            <div > Sayantan</div>
                        </div>
                        <div class="playnow">
                            <span>Play Now</span>
                        <img  class="invert" src="playsong.svg" alt="">
                    </div>
                    </li>`   
}

Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
   
    e.addEventListener("click",element=>{
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    })
});


 return songs
}



const playMusic = (track,pause=false)=>{
     currentSong.src=`http://127.0.0.1:5500/songs/${currFolder}/`+track
     if(!pause){
     currentSong.play()
      play.src = "pause.svg"
     }
    

     document.querySelector(".songinfo").innerHTML=decodeURI(track)

     document.querySelector(".songtime").innerHTML="00:00 / 00:00"
}

async function displayAlbums(){
    console.log("displaying albums")
    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index]; 
        if (e.href.includes("/songs/") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-1)[0]
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json(); 
            console.log(response)

            cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
            <div class="play">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                        stroke-linejoin="round" />
                </svg>
            </div>

            <img src="/songs/${folder}/cover.jpg" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`

        }
    }

    
}







async function main(){
 
songs = await getSongs("Cs");
playMusic(songs[0],true)

console.log(songs)


 await displayAlbums()



play.addEventListener("click", () => {
    if (currentSong.paused) {
        currentSong.play()
        play.src = "pause.svg"
    }
    else {
        currentSong.pause()
        play.src = "playsong.svg"
    }
})

currentSong.addEventListener("timeupdate",()=>{
    document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentSong.currentTime)}  :  ${secondsToMinutesSeconds(currentSong.duration)}`

    document.querySelector(".circle").style.left =(currentSong.currentTime/currentSong.duration)*100 +"%";
})

document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = ((currentSong.duration) * percent) / 100
})


document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0"
})

document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-110%"
})


previous.addEventListener("click", () => {
    currentSong.pause()
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if ((index - 1) >= 0) {
        playMusic(songs[index - 1])
    }
})

// Add an event listener to next
next.addEventListener("click", () => {
    currentSong.pause()
  

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if ((index + 1) < songs.length) {
        playMusic(songs[index + 1])
    }
})


document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",e=>{
    currentSong.volume=parseInt(e.target.value)/100
})



Array.from(document.getElementsByClassName("card")).forEach(e=>{

e.addEventListener("click", async items=>{
    songs = await getSongs(`${items.currentTarget.dataset.folder}`);
    console.log(songs);
})

})


document.querySelector(".volume>img").addEventListener("click", e=>{ 
    if(e.target.src.includes("volume.svg")){
        e.target.src = e.target.src.replace("volume.svg", "mute.svg")
        currentSong.volume = 0;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
    }
    else{
        e.target.src = e.target.src.replace("mute.svg", "volume.svg")
        currentSong.volume = .10;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
    }

})





}

main();