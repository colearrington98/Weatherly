// Replace this with your OpenWeatherMap API key
const apiKey = "d7f204b9fb0c4acf3751cc73d246b0b3";

$(document).ready(function () {
  let searchHistory = [];

  $("#search-button").click(function () {
    const cityName = $("#city-input").val();
    searchCity(cityName);
  });

  $(document).on("click", ".city-history", function () {
    const cityName = $(this).text();
    searchCity(cityName);
  });

  function searchCity(cityName) {
    fetchWeatherData(cityName).then((data) => {
      displayCurrentWeather(data.currentWeather);
      display5DayForecast(data.forecast);
      addToSearchHistory(cityName);
    });
  }

  async function fetchWeatherData(cityName) {
    const currentWeatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
    );
    const currentWeather = await currentWeatherResponse.json();

    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`
    );
    const forecast = await forecastResponse.json();

    return {
      currentWeather: currentWeather,
      forecast: forecast.list,
    };
  }

  function displayCurrentWeather(weather) {
    // Display the current weather information
    $("#current-weather").html(`
      <h2>${weather.name} (${new Date().toLocaleDateString()})</h2>
      <img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}.png" alt="${weather.weather[0].description}" />
      <p>Temperature: ${weather.main.temp} °C</p>
      <p>Humidity: ${weather.main.humidity}%</p>
      <p>Wind Speed: ${weather.wind.speed} m/s</p>
    `);
  }

  function display5DayForecast(forecast) {
    const dailyForecasts = forecast.filter((entry) =>
      entry.dt_txt.endsWith("12:00:00")
    );

    $("#forecast").empty();

    dailyForecasts.forEach((day) => {
      $("#forecast").append(`
        <div class="forecast-day">
          <h3>${new Date(day.dt_txt).toLocaleDateString()}</h3>
          <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}" />
          <p>Temperature: ${day.main.temp} °C</p>
          <p>Wind Speed: ${day.wind.speed} m/s</p>
          <p>Humidity: ${day.main.humidity}%</p>
        </div>
      `);
    });
  }

  function addToSearchHistory(cityName) {
    if (!searchHistory.includes(cityName)) {
      searchHistory.push(cityName);

      $("#search-history").append(`
        <button class="city-history">${cityName}</button>
      `);
    }
  }
});
