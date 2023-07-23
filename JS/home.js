let date = new Date().getTime();
console.log(date);



const mycards = document.querySelector("#my-cards");
const input = document.getElementById("input");
const count = document.getElementById("count");

// for count in small screens using off canvas component
const count1 = document.getElementById("count1");


const URL = `https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hashValue}`;

let favourites = JSON.parse(localStorage.getItem("FAVOURITES")) || [];
let marvelList = JSON.parse(localStorage.getItem("MARVELS")) || [];


// getting data from api
async function getData(query) {
    let list = [];
    let response;
    // getting marvels data based on search query
    if (query) {
        let SEARCH_URL = URL + `&nameStartsWith=${query}`;
        response = await fetch(SEARCH_URL)
    }
    // getting popular marvels on 1st render
    else {
        console.log("hi")
        response = await fetch(URL);
    }
    const {data} = await response.json();
    data.results.forEach((marvel) => list.push(marvel));
    localStorage.setItem("MARVELS", JSON.stringify(list));
    renderMarvels();
}
getData("")


document.addEventListener("click", handleClickEvents);




function handleClickEvents(e) {
    // console.log(e.target)
    if (e.target.className == "btn btn-outline-warning") {
        e.preventDefault();
        let search = input.value;
        getData(search);
        input.value=""
    }
    if (e.target.className == "add-favourites") {
        e.preventDefault();
        let id = e.target.id;
        addToFavourites(id);
    }
    if (e.target.className == "remove-favourites") {
        let id = e.target.id;
        removeFromFavourites(id);
    }
    if (e.target.className == "card-img-text" || e.target.className == "fa-solid fa-film" || e.target.className == "overlay" ) {
        let id = e.target.id;
        showHero(id);

    }

}

// dsplaying the UI
function renderMarvels() {
    count.innerHTML = favourites.length;
    count1.innerHTML = favourites.length;
    let marvelList = JSON.parse(localStorage.getItem("MARVELS")) || [];
    let str = "";
    if (marvelList.length) {
        marvelList.map((marvel) => {
            let id = marvel.id;
            let isPresentFavourites = false;
            favourites.map(movie => {
                if (movie.id == id) {
                    isPresentFavourites = true;
                    return;
                }
            });

            // creating dynamic button based on movie is present in watchlist or not
            let myButtn;
            if (isPresentFavourites) {
                myButtn = `  <button class="butn" title="remove from favourites">
                        <img src="./images/remove.png" class="remove-favourites" id=${marvel.id} />
                        <span class="remove-favourites" id=${marvel.id}>Remove from favourites</span>
                    </button>`
            } else {
                myButtn = `<button class="butn" title="add to favourites">
                        <img src="./images/video.png" class="add-favourites" id=${marvel.id} />
                        <span class="add-favourites" id=${marvel.id}>Add to favourites</span>
                    </button>`
            }

            let src = "";
            if (marvel.thumbnail["path"] == null) {
                src='./images/noimage.jpg'
            } else {
                src = marvel.thumbnail["path"] + "." + marvel.thumbnail["extension"];   
            }
            
            str += `
            <div class="card" style="width: 18rem;">
                <div class="image">
                    <img src=${src}  alt="..." />
                    <div class="overlay" id=${id}>
                        <p class="card-img-text" id=${id}>click for more</p>
                        <i class="fa-solid fa-film" id=${id}></i>
                    </div>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${marvel.name}</h5>
                    <p class="card-text">
                        <span class="type-name">comics:</span> <span class="type-count">${marvel.comics.available}</span>
                    </p>
                     <p class="card-text">
                        <span class="type-name">series:</span> <span class="type-count">${marvel.series.available}</span>
                    </p>
                    <p class="card-text">
                        <span class="type-name">stories:</span> <span class="type-count">${marvel.stories.available}</span>
                    </p>
                    <div class="actions">
                    ${myButtn}
                    </div>
                </div>
            </div>`;
        })
        mycards.innerHTML = str;
    }
    else {
        mycards.innerHTML = `<h1>Loading...</h1>`;
    }
}

// adding to faourites/watchlist
function addToFavourites(id) {
    // getting the movie
    let fav_list = JSON.parse(localStorage.getItem("MARVELS")) || [];
    let fav = fav_list.filter(marvel => marvel.id == id);
    console.log("chk",fav[0])
    favourites.push(fav[0]);
    count.innerHTML = favourites.length;
    count1.innerHTML = favourites.length;

    localStorage.setItem("FAVOURITES", JSON.stringify(favourites));
    renderMarvels();
}

// remove from watchlist
function removeFromFavourites(id) {
    favourites = favourites.filter(movie => movie.id != id)
    count.innerHTML = favourites.length;
    count1.innerHTML = favourites.length;

    localStorage.setItem("FAVOURITES", JSON.stringify(favourites));
    renderMarvels();
}


// tool tips from bootstrap
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));


