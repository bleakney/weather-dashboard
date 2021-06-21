// ae4b46d6f8639dba67ca6ba5c176e2a5 (weatherkey)
// api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}

let searchInputElement = document.querySelector("#searchInput");
let searchFormElement = document.querySelector("#searchForm");
let cityNameElement = document.querySelector("#cityName");
let currentTempElement = document.querySelector("#currentTemp");
let currentWindElement = document.querySelector("#currentWind");
let currentHumidityElement = document.querySelector("#currentHumidity");
let currentUVElement = document.querySelector("#currentUV");
let currentWeatherIconElement = document.querySelector("#currentWeatherIcon");
let searchHistoryArray = [];
let searchHistoryButtonsContainer = document.querySelector(".searchHistoryButtons");
let cityButtons = document.querySelector(".cityButton")
let body = document.querySelector("body");

// let fiveDayForecastCardArray = [document.querySelector("#forecastCard0"), document.querySelector("#forecastCard1"), document.querySelector("#forecastCard2"), document.querySelector("#forecastCard3"), document.querySelector("#forecastCard4")];

var formSubmitHandler = function (event) {
  // prevent page reload on form submission
  event.preventDefault();
  // get value from input element (use .trim() method in case user puts a leading or trailing space in the input)
  var cityName = searchInputElement.value.trim();
  if (cityName) {
    retrieveWeather(cityName);
    searchHistoryArray.unshift(cityName);
    localStorage.setItem("city", JSON.stringify(searchHistoryArray));
    createButton();
    searchInputElement.value = "";
  } else {
    alert("Please enter a valid city name.");
  }
};

// submit button event handler
searchFormElement.addEventListener("submit", formSubmitHandler);

// function to fetch weather data from Open Weather API
var retrieveWeather = function (city) {
  fetch(
    "https://api.openweathermap.org/data/2.5/find?q=" +
      city +
      "&units=imperial&appid=bc9f060cbb3af2ea6d20a6c9dcd6a6d5"
  ).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        if (data.count === 0) {
          alert("Please enter a valid city name.");
        } else {
          console.log(data);
          displayUVIndex(data);
          console.log(data.list[0].main.temp);
        }
      });
    }
  });
};

function displayDates(){
    for (let i = 0; i < 6; i++) {
        // display date
        let currentDate = moment();
        let displayDate = currentDate.clone().add(i, "day").format("MM/DD/YY");
        document.querySelector("#forecastCard" + i).querySelector("h5").textContent = displayDate;
        console.log(displayDate);
}}
displayDates();

function displayWeather(data) {
  // display weather in large current weather box
  cityNameElement.textContent = "Current Weather for " + data.list[0].name;
  currentWeatherIconElement.setAttribute(
    "src",
    "http://openweathermap.org/img/wn/" +
      data.list[0].weather[0].icon +
      "@2x.png"
  );
  cityNameElement.appendChild(currentWeatherIconElement);
  currentTempElement.textContent = "Temp: " + data.list[0].main.temp + "\u00B0";
  currentWindElement.textContent = "Wind: " + data.list[0].wind.speed + " MPH";
  currentHumidityElement.textContent =
    "Humidity: " + data.list[0].main.humidity + "%";
  // display 5-day forecast in boxes
  for (let i = 0; i < data.list.length; i++) {
    // display date
    let currentDate = moment();
    let displayDate = currentDate.clone().add(i, "day").format("MM/DD/YY");
    document
      .querySelector("#forecastCard" + i)
      .querySelector("h5").textContent = displayDate;
    console.log(displayDate);

    // display icon
    document
      .querySelector("#forecastCard" + i)
      .querySelector("img")
      .setAttribute(
        "src",
        "http://openweathermap.org/img/wn/" +
          data.list[i].weather[0].icon +
          "@2x.png"
      );

    // display temp
    document
      .querySelector("#forecastCard" + i)
      .querySelector(".dailyTemp").textContent =
      "Temp: " + data.list[i].main.temp + "\u00B0";

    // display wind
    document
      .querySelector("#forecastCard" + i)
      .querySelector(".dailyWind").textContent =
      "Wind: " + data.list[i].wind.speed + " MPH";
    //   document.querySelector("#forecastCard" + i).querySelector("h5").textContent = moment.unix(data.list[i].dt).format("MM/DD/YYYY");

    // display humidity
    document
      .querySelector("#forecastCard" + i)
      .querySelector(".dailyHumidity").textContent =
      "Humidity: " + data.list[i].main.humidity + "%";
  }
}

function displayUVIndex(data) {
  fetch(
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      data.list[0].coord.lat +
      "&lon=" +
      data.list[0].coord.lon +
      "&units=imperial&appid=bc9f060cbb3af2ea6d20a6c9dcd6a6d5"
  ).then(function (response) {
    if (response.ok) {
      response.json().then(function (data2) {
        console.log(data2);
        displayWeather(data);
        currentUVElement.textContent = "UV Index: " + data2.current.uvi;
      });
    }
  });
}

function createButton() {
    let cityNamesArray = JSON.parse(localStorage.getItem("city"))
    let cityButton = document.createElement("button");
    cityButton.setAttribute("class", "btn btn-primary cityButtons");
    cityButton.setAttribute("value", cityNamesArray[0]);
    cityButton.setAttribute("type", "button")
    cityButton.textContent = cityNamesArray[0];
    searchHistoryButtonsContainer.appendChild(cityButton);
   let cityButtonValue = cityButton.value;
    $(cityButton).on("click", cityButtonHandler);
}
function cityButtonHandler(event){
    event.preventDefault();
    let activeButton = $(event.target);
    console.log(activeButton);
    let cityName = activeButton[0].outerText;
    console.log(cityName);
    retrieveWeather(cityName);

}





