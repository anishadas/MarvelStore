
const myFavourites = JSON.parse(localStorage.getItem("FAVOURITES")) || [];
const addMovie = document.querySelector("#movie");
// for count in small screens using off canvas component
const count2 = document.getElementById("count2");

// event listener to add the move to watchlist
document.addEventListener('click', (e) => {
    if (e.target.className == "watch-btn") {
        let id = e.target.id;
        addFavourites();
    }
})


// getting data using id from omdb
async function showHero(id) {
    const URL = `https://gateway.marvel.com:443/v1/public/characters/${id}?ts=${ts}&apikey=${publicKey}&hash=${hashValue}`;
    const response = await fetch(URL);
    const { data } = await response.json();
    window.location.href = './marvel.html';
    localStorage.setItem("MARVELHERO", JSON.stringify(data.results));
}

async function showType(id, type) {
    const URL_type = `https://gateway.marvel.com:443/v1/public/characters/${id}/${type}?ts=${ts}&apikey=${publicKey}&hash=${hashValue}`
    const response = await fetch(URL_type);
    const { data } = await response.json();
    let typeData = data.results;
    // console.log("c",typeData)
    typeData = typeData.slice(0, 3);
    // console.log("data", typeData);
    return typeData
}

function typeDisplay(arr, type) {
    let str = "";
    if (type == "stories" || type == "events") {
        arr.splice(0, 4).forEach(type => {
            
            let name = type.name.slice(0, type.name.indexOf('#') - 1)
            str += `
            <span class="badge text-bg-info">${name}</span>
        `
        })
    } else {
        if (arr.length > 0) {
            arr.forEach(type => {
                let title = "";
                if (type.title.indexOf("#") != -1) {
                    title = type.title.slice(0, type.title.indexOf('#'))
                }
                else {
                    title = type.title;
                }
                let src = type.thumbnail["path"] + "." + type.thumbnail["extension"];
                str += `
            <div class="card">
                <div class="type-image">
                    <img src=${src} alt="...">
                </div>
                <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                </div>
            </div>
        `
            })
        }

    }

    return str;
}
// displaying data on a movie
async function displayHero() {
    const hero = JSON.parse(localStorage.getItem("MARVELHERO")) || [];
    count2.innerHTML = myFavourites.length;
    let str = "";
    console.log(hero[0])
    if (hero.length > 0) {

        const { name, description, thumbnail, stories, events, id } = hero[0];
        console.log(hero[0])
        // comics
        let typearr = await showType(id, "comics");
        let comic_ui = typeDisplay(typearr, "comics");

        // series
        typearr = await showType(id, "series");
        let series_ui = typeDisplay(typearr, "series");

        // stories
        let stories_arr = stories.items;
        let stories_ui = typeDisplay(stories_arr, "stories");

        // events
        let event_arr = events.items;
        let events_ui = typeDisplay(event_arr, "events");

        // poster path
        let src = "";
        if (thumbnail["path"] == null) {
            src = './images/noimage.jpg'
        } else {
            src = thumbnail["path"] + "." + thumbnail["extension"];
        }

        str += `
        <div class="row" id="movie">
            <div class="col-sm-6 banner">
                <h5 class="title">${name}</h5>
                
                <div class="poster">
                    <img src=${src} class
                        alt="..." >
                </div>
            </div>
            <div class="col-sm-6 movie-data">
                <p class="title">Abouts: </p>
                <p class="text">
                    ${description}
                </p>
                <button class="watch-btn" id=${id}>
                    <img src="./images/video.png" />
                    Add To Watchlist
                </button>
            </div>
        </div>
        <p class="type-headers">COMICS : </p>
        <div class="row">
            <div class="col-sm-10 types">
               ${comic_ui}
            </div>
        </div>
        <p class="type-headers">SERIES : </p>
         <div class="row">
            <div class="col-sm-10 types">
                ${series_ui}
            </div>
        </div>
        <p class="type-headers">STORIES : </p>
        <div class="row">
            <div class="col-sm-10 types">
                ${stories_ui}
            </div>
        </div>
        <p class="type-headers">EVENTS : </p>
        <div class="row">
            <div class="col-sm-10 types">
                ${events_ui}
            </div>
        </div>

    `
        addMovie.innerHTML = str;
    }
    else {
        addMovie.innerHTML = `<h1>no marvels yet</h1>`
    }

}

displayHero();

function displayTypes() {

}
// add movie to watchlist
function addFavourites() {

    const hero = JSON.parse(localStorage.getItem("MARVELHERO")) || [];

    // checking if movie already in watchList
    let isPresent = false;
    myFavourites.map(item => {
        if (item.id == hero.id) {
            isPresent = true;
            alert("Marvel already in favourites");
            return;
        }
    });
    if (!isPresent) {
        myFavourites.push(hero[0]);
    }
    count.innerHTML = myFavourites.length;
    count2.innerHTML = myFavourites.length;
    localStorage.setItem("FAVOURITES", JSON.stringify(myFavourites));
}