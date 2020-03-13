'use strict';

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

$(".navcontent").click(function () {
    $(".set").hide();
});

$(".back").click(function () {
    $(".set").show();
});

function openSet(evt, setName) {
    var i, setcontent, settablinks;
    setcontent = document.getElementsByClassName("setcontent");
    for (i = 0; i < setcontent.length; i++) {
        setcontent[i].style.display = "none";
    }
    settablinks = document.getElementsByClassName("settablinks");
    for (i = 0; i < settablinks.length; i++) {
        settablinks[i].className = settablinks[i].className.replace(" active", "");
    }
    document.getElementById(setName).style.display = "block";
    evt.currentTarget.className += " active";
}

function openCon(evt, navName) {
    // Declare all variables
    var i, navcontent, navicons;

    // Get all elements with class="tabcontent" and hide them
    navcontent = document.getElementsByClassName("navcontent");
    for (i = 0; i < navcontent.length; i++) {
        navcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    navicons = document.getElementsByClassName("navicons");
    for (i = 0; i < navicons.length; i++) {
        navicons[i].className = navicons[i].className.replace("active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(navName).style.display = "block";
    evt.currentTarget.className += " active";
}


// api search key and endpoint!
const apiKey = 'af866e5b4803476395086df34aa5b0af';
const searchURL = 'https://api.spoonacular.com/recipes/complexSearch';

// get the api endpoint url and attach the api key 
function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}


function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        const searchTerm = $('#js-search-term').val();
        const maxResults = $('#js-max-results').val();
        getUserRecipeSearchResults(searchTerm, maxResults);
    });
}

$(watchForm);

function getUserRecipeSearchResults(query, maxResults = 6) {
    const params = {
        apiKey: apiKey,
        query: query,
        number: maxResults,
        addRecipeInformation: true,
        instructionsRequired: true,
        fillIngredients: true,
    };
    const queryString = formatQueryParams(params)
    const url = searchURL + '?' + queryString;

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
    // let recipeinfo = {responseJson}
}

function displayResults(obj) {
    $('#results-list').empty();
    for (let i = 0; i < obj.results.length; i++) {
        $('#results-list').append(
            `<div class="recipe-container" id="${obj.results[i].id}">
                <div class="recipe-photo" >
                    <img src="${obj.results[i].image}" alt="">
                </div>
                    <h3>${obj.results[i].summary.substring(0, 61) + " ..."}</h3>
            </div>`
        )
    };
    $('#hidden-results').removeClass('hidden');
    $('#home-con-toggle').hide();
    showRecipePage(obj);
};


function showRecipePage(obj) {
    $('.recipe-container').click(event => {
        let chosenID = event.currentTarget.id;
        console.log(chosenID);
        $(".home-header").addClass("hidden")
        $("#results-list").addClass("hidden");
        $('.recipe-container').addClass("hidden");
        $(".recipe-ingredients-con").toggleClass("hidden");
        for (let i = 0; i < obj.results.length; i++) {
            if (obj.results[i].id == chosenID) {
                //render image
                $('.recipe-img').html(`<img src="${obj.results[i].image}">`)
                //render ingredients

                for (let j = 0; j < obj.results[i].usedIngredients.length; j++) {
                    $('.ingredient').append(`<li>${obj.results[i].usedIngredients[j].original}</li>`)
                }
                for (let j = 0; j < obj.results[i].missedIngredients.length; j++) {
                    $('.ingredient').append(`<li>${obj.results[i].missedIngredients[j].original}</li>`)
                }
                //render instructions
                obj.results[i].analyzedInstructions[0].steps.forEach(obj => {
                    $('#Directions').find('ol').append(`<li>${obj.step}</li>`)
                })
            }
        }
    })
}