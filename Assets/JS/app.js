var cityInput = document.getElementById("city-text");
var cityForm = document.getElementById("city-form")
var cityHistory = document.getElementById("city-history");

var cities = [];

function renderHistory() {
    console.log(cities)
    for (var i = 0; i < cities.length; i++) {
        var city = cities[i]
        var li = document.createElement("li");
        li.textContent = city;
        li.setAttribute("data-index", i);
        li.classList.add("box");
        cityHistory.appendChild(li);
        console.log(cityHistory)
  }
}

function init() {
    var storedCities = JSON.parse(localStorage.getItem("cities"));
    if (storedCities !== null) {
        cities = storedCities;
    }
   renderHistory(); 
}

function storeCities() {
    localStorage.setItem("cities",JSON.stringify(cities));
}
 
var submitButton = document.getElementById("submit");
submitButton.addEventListener("click", function() {

    var cityText = cityInput.value;
    if (cityText === "") {
        return;
    }

    cities.push(cityText);
    cityInput.value = "";

    storeCities();
    renderHistory();
});

init();
