let myFavs = JSON.parse(localStorage.getItem("FAVOURITES")) || [];
const fav_el = document.getElementById("my-fvaourites");
const count3 = document.getElementById("count3");

// event lstener for removing the movie
document.addEventListener('click', (e) => {
    if (e.target.className == "buttn") {
        id = e.target.id;
        removeMarvel(id);
    }
})


// for UI display
function displayList() {
    let str = "";
    console.log("favs", myFavs);
    if (myFavs.length>0) {
        myFavs.forEach(marvel => {
            let src = marvel.thumbnail["path"] + "." + marvel.thumbnail["extension"];
            str += `
              <div class="row">
                <div class="col-sm-8 movie">
                    <div class="image">
                        <img
                            src=${src} />
                    </div>
                   <div class="info">
                        <p class="title">${marvel.name}</p>
                        <button class="buttn" id=${marvel.id}>Remove</button>
                    </div>
                </div>
            </div>
            `
        });
        fav_el.innerHTML = str;

    }
    else {
        fav_el.innerHTML = `<h1>No Marvels in Favourites</h1>`;

    }
    count.innerHTML = myFavs.length;
    count3.innerHTML = myFavs.length;
}

displayList();



// remove from watchlist
function removeMarvel(id) {
    myFavs = myFavs.filter(marvel => marvel.id != id);
    localStorage.setItem("FAVOURITES", JSON.stringify(myFavs));
    displayList();
}