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
  celsiusTemperature = Math.round(response.data.main.temp);
  celsiusFeelsLikeTemperature = Math.round(response.data.main.feels_like);
  windSpeedMetric = Math.round(response.data.wind.speed);
  let windSpeedUnit = document.querySelector("#wind-speed-unit");

  windSpeedUnit.innerHTML = " meter/sec";
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#temperature").innerHTML = celsiusTemperature;
  document.querySelector("#feels-like-temperature").innerHTML =
    celsiusFeelsLikeTemperature;
  document.querySelector("#main-description").innerHTML =
    response.data.weather[0].main;
  document.querySelector("#wind-speed").innerHTML = windSpeedMetric;
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
  getForecast(response.data.coord);

  celsius.classList.add("active");
  fahrenheit.classList.remove("active");
}

function getCityData(city) {
  let apiKey = "d9682284ab68bba42fdaf690958f42f3";
  let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  axios.get(apiURL).then(changeData);
}

function updateCity(event) {
  event.preventDefault();
  let city = document.querySelector("#search-bar").value;
  getCityData(city);
  document.getElementById("city-form").reset();
}

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

//convert to Fahrenheit or Celcius

function convertToFahrenheit(event) {
  event.preventDefault();

  let fahrenheitTemperature = Math.round((celsiusTemperature * 9) / 5 + 32);
  let fahrenheitFeelsLikeTemperature = Math.round(
    (celsiusFeelsLikeTemperature * 9) / 5 + 32
  );
  let windSpeedImperial = Math.round(windSpeedMetric * 2.237);

  temperatureElement.innerHTML = fahrenheitTemperature;
  feelsLikeTemperatureElement.innerHTML = fahrenheitFeelsLikeTemperature;
  windSpeedElement.innerHTML = windSpeedImperial;
  windSpeedUnit.innerHTML = " miles/hour";
  celsius.classList.remove("active");
  fahrenheit.classList.add("active");
}

function convertToCelsius(event) {
  event.preventDefault();
  temperatureElement.innerHTML = celsiusTemperature;
  feelsLikeTemperatureElement.innerHTML = celsiusFeelsLikeTemperature;
  windSpeedElement.innerHTML = windSpeedMetric;
  windSpeedUnit.innerHTML = " meter/sec";
  celsius.classList.add("active");
  fahrenheit.classList.remove("active");
}

//format forecast date
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

//update Emoji
function updateEmoji(main) {
  let emoji = "😳";

  if (main === "Thunderstorm") {
    emoji = "⚡️";
  } else {
    if (main === "Drizzle") {
      emoji = "☔️";
    } else {
      if (main === "Rain") {
        emoji = "🌧";
      } else {
        if (main === "Snow") {
          emoji = "❄️";
        } else {
          if (main === "Clouds") {
            emoji = "☁️";
          } else {
            if (
              main === "Mist" ||
              main === "Smoke" ||
              main === "Haze" ||
              main === "Dust" ||
              main === "Fog" ||
              main === "Sand" ||
              main === "Ash" ||
              main === "Squall" ||
              main === "Tornado"
            ) {
              emoji = "🌫";
            } else {
              emoji = "☀️";
            }
          }
        }
      }
    }
  }

  return emoji;
}

//display forecast on the right

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = "";

  forecast.forEach(function (dailyForecast, index) {
    if (index > 0 && index < 6) {
      forecastHTML += ` <ul>
    <span id = "emoji">${updateEmoji(dailyForecast.weather[0].main)}</span>
      ${formatDay(dailyForecast.dt)}
          <div class="temp">
          <span id="day-temp">${Math.round(dailyForecast.temp.day)}°</span>
           <span id="night-temp">${Math.round(dailyForecast.temp.night)}°</span>
           </div>
        </ul>`;
    }
  });

  forecastElement.innerHTML = forecastHTML;
}

//get data for the forecast
function getForecast(coordinates) {
  let apiKey = "c8a77112b2faf6684bb4b21a0aa778ae";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=hourly,minutely&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

let temperatureElement = document.querySelector("#temperature");
let feelsLikeTemperatureElement = document.querySelector(
  "#feels-like-temperature"
);

let windSpeedElement = document.querySelector("#wind-speed");
let windSpeedUnit = document.querySelector("#wind-speed-unit");

let celsiusTemperature = null;
let celsiusFeelsLikeTemperature = null;
let windSpeedMetric = null;

let fahrenheit = document.querySelector("#fahrenheit");
fahrenheit.addEventListener("click", convertToFahrenheit);

let celsius = document.querySelector("#celsius");
celsius.addEventListener("click", convertToCelsius);

let searchForm = document.querySelector("#city-form");
searchForm.addEventListener("submit", updateCity);

let getCurrentLocationButton = document.querySelector(
  "#current-location-button"
);
getCurrentLocationButton.addEventListener("click", getCurrentLocationData);

getCityData("Berlin");
