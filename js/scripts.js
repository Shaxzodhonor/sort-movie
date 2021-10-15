// DOM elements
var elSearchForm = $_(".js-search-form");
var elTitleInput = $_(".js-search-form__title-input", elSearchForm);
var elRatingInput = $_(".js-search-form__rating-input", elSearchForm);
var elGenreSelect = $_(".js-search-form__genre-select", elSearchForm);
var elSortSelect = $_(".js-search-form__sort-select", elSearchForm);
var elSearchResults = $_(".search-results");

var elResultTemplate = $_("#search-result-template").content;

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

const searchMovie = () => {
  const userTitle     = elTitleInput.value,
        userRating    = elRatingInput.value,
        userCategory  = elGenreSelect.value;
  let   resultArr     = [];
        

  if(userTitle.length > 1){
    resultArr = normalizedMovies.filter(function(movie){
      return movie.title.toLowerCase().indexOf(userTitle.toLowerCase()) > -1;
    });
  }

  if(userRating){
    resultArr = resultArr.filter(function(movie){
      return movie.imdbRating >= userRating;
    });
  }

  if(userCategory !== 'all'){
    resultArr = resultArr.filter(function(movie){
      return movie.categories.join(" ").toLowerCase().indexOf(userCategory.toLowerCase()) > -1;
    });
  }

  return resultArr
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
// CREATE CARD FUNCTION

var createCardFunc = function(res){
  var docFragment = document.createDocumentFragment();
  
  res.forEach(function(movie){
    var newCard = elResultTemplate.cloneNode(true);

    $_(".movie__poster", newCard).src = movie.smallImage;
    $_(".movie__title", newCard).textContent = movie.title;
    $_(".movie__year", newCard).textContent = movie.year;
    $_(".movie__raitng", newCard).textContent = movie.imdbRating;
    $_(".movie-trailer-link", newCard).href = movie.trailer;
    
    docFragment.appendChild(newCard);
  })
  elSearchResults.appendChild(docFragment);
}


elSearchForm.addEventListener('submit', function(evt){
  evt.preventDefault();
  elSearchResults.innerHTML = "";
  var resultArray = searchMovie();
  sortsFunc(resultArray);
  
  
  createCardFunc(resultArray);

});








