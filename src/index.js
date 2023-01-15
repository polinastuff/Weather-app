//get time of the searched city
function getDate(timezone) {
  let date = new Date();
  let utcDate = date.getTime() + date.getTimezoneOffset() * 60000;
  let cityDate = utcDate + timezone * 1000;
  let newCityDate = new Date(cityDate);

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = newCityDate.getDay();
  let hours = newCityDate.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = newCityDate.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let fullDate = `${days[day]}, ${hours}:${minutes}`;
  return fullDate;
}

//to change the city and data

function changeData(response) {
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#temperature").innerHTML =
    Math.round(response.data.main.temp) + " °C";
  document.querySelector("#feels-like-temperature").innerHTML =
    Math.round(response.data.main.feels_like) + "°";
  document.querySelector("#main-description").innerHTML =
    response.data.weather[0].main;
  document.querySelector("#wind-speed").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#full-date").innerHTML = getDate(
    response.data.timezone
  );
  document
    .querySelector("#weather-icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
}

function updateCity(event) {
  event.preventDefault();
  let city = document.querySelector("#search-bar").value;
  getCityData(city);
}

function getCityData(city) {
  let apiKey = "d9682284ab68bba42fdaf690958f42f3";
  let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  axios.get(apiURL).then(changeData);
}

let searchForm = document.querySelector("#city-form");
searchForm.addEventListener("submit", updateCity);

getCityData("Berlin");

//get current location data

function getURL(location) {
  let apiKey = "d9682284ab68bba42fdaf690958f42f3";
  let URL = `https://api.openweathermap.org/data/2.5/weather?${location}&appid=${apiKey}&units=metric`;
  return URL;
}

function getLocation(response) {
  let latitude = response.coords.latitude;
  let longitude = response.coords.longitude;
  let location = `lat=${latitude}&lon=${longitude}`;

  axios.get(getURL(location)).then(changeData);
}

function getCurrentLocationData(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getLocation);
}

let getCurrentLocationButton = document.querySelector(
  "#current-location-button"
);
getCurrentLocationButton.addEventListener("click", getCurrentLocationData);
