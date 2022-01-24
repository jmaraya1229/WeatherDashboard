var cityInput = document.getElementById("city-text");
var cityForm = document.getElementById("city-form")
var cityHistory = document.getElementById("city-history");
const myKey = "1caeb144b3d52228ebc13b0c9b582ab2";
var currentCityContainer = document.getElementById("currentContainer");
var cities = [];

function renderHistory() {
    cityHistory.innerHTML = "";
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

    getCurrent(cityInput.value)
    .then(result => {
        document.getElementById("currentCityName").innerHTML = result.name;
    })

    getCurrent(cityInput.value)
    .then(result => getOneCall(result.coord.lat, result.coord.lon))
    .then(finalResult => {
        populateCurrentCity(finalResult);
    })

    getFiveDayForeCast(cityInput.value)
    .then(result => {
        // Day 1
        let icon = result.list[0].weather[0].icon;
        console.log(icon)
        document.getElementById("day-one-date").innerHTML = convertUnixToDate(result.list[0].dt);
        document.getElementById("day-one-icon").src = "http://openweathermap.org/img/w/" + icon + ".png";
        document.getElementById("day-one-temp").innerHTML = "Temp: " + result.list[0].main.temp + "&deg;F"; 
        document.getElementById("day-one-wind").innerHTML = "Wind: " + result.list[0].wind.speed + " mph";
        document.getElementById("day-one-humidity").innerHTML = "Humidity: " + result.list[0].main.humidity + "%";
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

async function getFiveDayForeCast(city_name) {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city_name}&units=imperial&appid=${myKey}`
        );
  
      const data = await response.json();
  
      return data;
}

function convertUnixToDate(unix_time){
    const unixTimestamp = unix_time;
    const milliseconds = unixTimestamp * 1000;
    const dateObject = new Date(milliseconds);
    let options = {month:'numeric', day:'numeric', year:'numeric'};
    
    return dateObject.toLocaleString('en-US', options);
}

function populateCurrentCity(currentCityValues) {
    const humanDateFormat = convertUnixToDate(currentCityValues.current.dt)
    let UVColor = currentCityValues.current.uvi

    function changeUVColor() {
        if (UVColor <= 2) {
            document.getElementById("currentUVI").style.color = "white";
            document.getElementById("currentUVI").style.backgroundColor = "green";
        } else if (UVColor >= 6) {
            UVColor.style.backgroundColor = "red";
        } else {
            UVColor.style.backgroundColor = "yellow";
        }
        return UVColor;
    }

    document.getElementById("currentDate").innerHTML = humanDateFormat;
    document.getElementById("currentTemp").innerHTML = "Temp: " + currentCityValues.current.temp + "&deg;F";
    document.getElementById("currentWindSp").innerHTML = "Wind: " + currentCityValues.current.wind_speed + " mph";
    document.getElementById("currentHumidity").innerHTML = "Humidity: " + currentCityValues.current.humidity + "%";
    document.getElementById("currentUVI").innerHTML = "UV Index: " + changeUVColor();
}

cityHistory.addEventListener("click", function() {
    for (var i = 0; i < cityHistory.childNodes.length; i++){
        var savedCity = cityHistory.childNodes[i]
        savedCity.addEventListener("click", function(event) {
            console.log(event.target.innerHTML)
            if (event.target.innerHTML === null) {
                return;
            }
            else{
                getCurrent(event.target.innerHTML)
                .then(result => {
                    document.getElementById("currentCityName").innerHTML = result.name;
                })
        
                getCurrent(event.target.innerHTML)
                .then(result => getOneCall(result.coord.lat, result.coord.lon))
                .then(finalResult => {
                    populateCurrentCity(finalResult);
                })
                cityHistory.innerHTML = "";
                renderHistory()
            }
        });
    }
});

