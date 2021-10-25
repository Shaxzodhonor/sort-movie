// DOM elements
var elSearchForm = $_(".js-search-form");
var elTitleInput = $_(".js-search-form__title-input", elSearchForm);
var elRatingInput = $_(".js-search-form__rating-input", elSearchForm);
var elGenreSelect = $_(".js-search-form__genre-select", elSearchForm);
var elSortSelect = $_(".js-search-form__sort-select", elSearchForm);
var elSearchResults = $_(".search-results");
var elModalTitle = $_(".js-modal-title");
var elModalText = $_(".js-modal-text");
var bookmarkList = $_(".js-bookmark-list");


var elResultTemplate = $_("#search-result-template").content;

// const filteredMovies = movies.map(function(movie){
//   return getMovieList(movie);
// });

// ===================================
//  CREATE CATEGORY OPTION FUNCTION
// ===================================

const createCategoryOptionFunction = function() {
  let movieCategoryOptionArray = [];

  normalizedMovies.forEach(function (movie){
    movie.categories.forEach(function(category){
      if (!movieCategoryOptionArray.includes(category)){
        movieCategoryOptionArray.push(category);
      }
    })
  })
  
  movieCategoryOptionArray.sort();
  var docFragment = document.createDocumentFragment();

  movieCategoryOptionArray.forEach(function(category){
    let newOption = createElement('option', ' ', category);
    newOption.value = category;
    docFragment.appendChild(newOption);
  })
  elGenreSelect.appendChild(docFragment);
}
createCategoryOptionFunction();

// SEARCH FUNC 1

// const searchMovie = () => {
//   const userTitle     = elTitleInput.value,
//         userRating    = elRatingInput.value,
//         userCategory  = elGenreSelect.value;
//   let   resultArr     = [];
        

//   if(userTitle){
//     resultArr = normalizedMovies.filter(function(movie){
//       return movie.title.toLowerCase().indexOf(userTitle.toLowerCase()) > -1;
//     });
//   }

//   if(userRating){
//     resultArr = resultArr.filter(function(movie){
//       return movie.imdbRating >= userRating;
//     });  
//   }

//   if(userCategory !== 'all'){
//     resultArr = resultArr.filter(function(movie){
//       return movie.categories.join(" ").toLowerCase().indexOf(userCategory.toLowerCase()) > -1;
//     });
//   }

//   return resultArr
// }

// =============================================
// SEARCH FUNC 2

var searchMovie = function(title, raiting, genre) {
  
  return normalizedMovies.filter(function(movie){
    let  userCategory  = (genre === "all" || movie.categories.includes(genre));

    return (String(movie.title).match(title) && userCategory && movie.imdbRating >= raiting);
  });

}

// =================
//SORT FUNCTIONS
// =================
//A--Z
var sortsFunc = function(asd) {
  if (elSortSelect.value == "az") {
    asd.sort(function(a, b){
      var x = a.title.toLowerCase(); 
      var y =  b.title.toLowerCase();
      if (x<y) {return -1}
      if (x>y) {return 1}
      return 0
    })
  } else if (elSortSelect.value == "za") {
    asd.sort(function(a, b){
      var x = a.title.toLowerCase(); 
      var y =  b.title.toLowerCase();
      if (x<y) {return 1}
      if (x>y) {return -1}
      return 0
    })
  } else if (elSortSelect.value == "rating_desc") {
    asd.sort(function(a, b){
      var x = a.imdbRating;
      var y =  b.imdbRating
      if (x<y) {return 1}
      if (x>y) {return -1}
      return 0
    })
  } else if (elSortSelect.value == "rating_asc") {
    asd.sort(function(a, b){
      var x = a.imdbRating;
      var y =  b.imdbRating
      if (x<y) {return -1}
      if (x>y) {return 1}
      return 0
    })
  } else if (elSortSelect.value == "year_desc") {
    asd.sort(function(a, b){
      var x = a.year; 
      var y =  b.year;
      if (x<y) {return 1}
      if (x>y) {return -1}
      return 0
    })
  } else if (elSortSelect.value == "year_asc") {
    asd.sort(function(a, b){
      var x = a.year; 
      var y =  b.year;
      if (x<y) {return -1}
      if (x>y) {return 1}
      return 0
    })
  }
  
}
//BOOKMARK RENDER==============================
const selectedMovies = JSON.parse(localStorage.getItem('movies')) || [];
var rend = function(){
  bookmarkList.innerHTML = '';

  selectedMovies.forEach(function(movie){
    let li = createElement("li", 'bg-white p-3 mb-3 d-flex justify-content-between align-items-center', '');
    let a = createElement('a', '', movie.title);
    a.href = movie.trailer;
    a.setAttribute('target', 'blank')
    li.appendChild(a);
    let button = createElement('button', 'btn btn-light', 'delete');
    li.appendChild(button);
    button.addEventListener('click', function(){
      selectedMovies.forEach(function(movi, i){
        if (movi.title === movie.title) {
          selectedMovies.splice(i, 1);
          localStorage.setItem('movies', JSON.stringify(selectedMovies));
          rend();
        }
      })
    })
    
    bookmarkList.appendChild(li);
  })
}
rend();
// ==========================

var bookmarkRender = function (movie){

  let isFound = false;
  if(selectedMovies.length){
    selectedMovies.forEach(function(item){
     if(item.id === movie.id){
      isFound = true;
     }
    });
  
    if(!isFound){
      selectedMovies.push(movie);
    }
   
  }else{
    selectedMovies.push(movie);
    console.log("2");
  }

  localStorage.setItem("movies", JSON.stringify(selectedMovies));

  rend();
}
// FORM SUBMIT==========================

elSearchForm.addEventListener('submit', function(evt){
  evt.preventDefault();
  elSearchResults.innerHTML = "";

  let regEx = new RegExp(elTitleInput.value, "gi")
  let  userRating    = Number(elRatingInput.value);

  var resultArray = searchMovie(regEx, userRating, elGenreSelect.value);
  
  sortsFunc(resultArray);
  // CREATE CARD FUNCTION

function createCardFunc(res){
  var docFragment = document.createDocumentFragment();
  
  res.forEach(function(movie){
    var newCard = elResultTemplate.cloneNode(true);

    $_(".movie__poster", newCard).src = movie.smallImage;
    if (regEx.source === '(?:)'){
      $_(".movie__title", newCard).textContent = movie.title;
    } else {
      $_(".movie__title", newCard).innerHTML = movie.title.replace(regEx, `<mark class="px-0">${movie.title.match(regEx)}</mark>`);
    }
    $_(".movie__year", newCard).textContent = movie.year;
    $_(".movie__raitng", newCard).textContent = movie.imdbRating;
    $_(".movie-trailer-link", newCard).href = movie.trailer;
    $_(".js-btn", newCard).textContent = "more";
    $_(".js-btn", newCard).addEventListener("click", function(){
      elModalTitle.textContent = movie.title;
      elModalText.textContent = movie.summary;
    })
    $_(".js-bookmark-button", newCard).addEventListener('click', function(){
      bookmarkRender(movie);
    })
    
    docFragment.appendChild(newCard);
  })
  elSearchResults.appendChild(docFragment);
}

  
  createCardFunc(resultArray);

});


//renderCard

//renderselectedMovies

//handleBookmark



