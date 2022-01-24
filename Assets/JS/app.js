var cityInput = document.getElementById("city-text");
var cityForm = document.getElementById("city-form")
var cityHistory = document.getElementById("city-history");
const myKey = "1caeb144b3d52228ebc13b0c9b582ab2";
var locationData = "";
var currentCityContainer = document.getElementById("currentContainer");
var cities = [];

function renderHistory() {
    for (var i = 0; i < cities.length; i++) {
        var city = cities[i]
        var li = document.createElement("li");
        li.textContent = city;
        li.setAttribute("data-index", i);
        li.classList.add("box", "button", "has-text-left");
        cityHistory.appendChild(li);
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
submitButton.addEventListener("click", function(event) {
    event.preventDefault();
    if (cityInput.value === "") {
        return;
    }

    locationData = getCurrent(cityInput.value);

    getCurrent(cityInput.value)
    .then(result => getOneCall(result.coord.lat, result.coord.lon))
    .then(finalResult => {
        populateCurrentCity(finalResult);
    })

    cities.push(cityInput.value);
    cityInput.value = "";

    storeCities();
    renderHistory();
});

init();


var clearButton = document.getElementById("clear");
clearButton.addEventListener("click", function() {
    localStorage.clear();
})

//  function searchApi ()
async function getCurrent(input) {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${input}&units=imperial&appid=${myKey}`
    );

    const data = await response.json();
    return data;
  }

async function getOneCall(lat, lng) {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&units=imperial&appid=${myKey}`
        );
  
      const data = await response.json();
  
      return data;
}

function populateCurrentCity(currentCityValues) {
    console.log(currentCityValues)
    const unixTimestamp = currentCityValues.current.dt
    const milliseconds = unixTimestamp * 1000 
    const dateObject = new Date(milliseconds)
    const humanDateFormat = dateObject.toLocaleString() 
    console.log(humanDateFormat)
    currentCityContainer.innerHTML = `

    <div class="card mx-auto mt-5" style="width: 18rem;">
        <div class="card-body justify-content-center">
            <h5 class="card-title"> $(humanDateFormat) </h5>
            <p class="card-text">Temp: $(currentCityValues.current.temp)F</p>
                <p>Wind: $(currentCityValues.current.wind_speed) MPH</p>
                <p>Humidity: $(currentCityValues.current.humidity) %</p>
                <p> UV Index: $(currentCityValues.current.uvi)</p>       
        </div>
    </div>
    
    `;
}

