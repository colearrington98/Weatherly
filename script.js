const apiKey = "d7f204b9fb0c4acf3751cc73d246b0b3"; // OpenWeather API key

$(document).ready(function () { // When the document is ready (i.e. the page has loaded) run the following code inside the function body
  let searchHistory = []; // Create an empty array to store the search history

  $("#search-button").click(function () { // When the search button is clicked run the following code inside the function body
    const cityName = $("#city-input").val(); // Get the value of the city input field and store it in a variable called cityName
    searchCity(cityName); // Call the searchCity function and pass the cityName variable as an argument
  });

  $(document).on("click", ".city-history", function () { // When a button with the class city-history is clicked run the following code inside the function body
    const cityName = $(this).text(); // Get the text of the button that was clicked and store it in a variable called cityName
    searchCity(cityName); // Call the searchCity function and pass the cityName variable as an argument
  }); 

  function searchCity(cityName) { // Create a function called searchCity that takes a cityName as an argument
    fetchWeatherData(cityName).then((data) => { // Call the fetchWeatherData function and pass the cityName variable as an argument. Then run the following code inside the function body
      displayCurrentWeather(data.currentWeather); 
      display5DayForecast(data.forecast); // Call the display5DayForecast function and pass the forecast data as an argument
      addToSearchHistory(cityName); 
    }); // Call the addToSearchHistory function and pass the cityName variable as an argument
  }

  async function fetchWeatherData(cityName) { // Create an async function called fetchWeatherData that takes a cityName as an argument
    const currentWeatherResponse = await fetch( // Call the fetch function and pass the following URL as an argument. Then store the response in a variable called currentWeatherResponse
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
    ); // The URL contains the cityName variable, the API key and the units we want the data to be in (metric)
    const currentWeather = await currentWeatherResponse.json(); // Convert the response to JSON and store it in a variable called currentWeather

    const forecastResponse = await fetch( // Call the fetch function and pass the following URL as an argument. Then store the response in a variable called forecastResponse
      `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`
    ); // The URL contains the cityName variable, the API key and the units we want the data to be in (metric)
    const forecast = await forecastResponse.json(); // Convert the response to JSON and store it in a variable called forecast

    return { // Return an object containing the currentWeather and forecast data
      currentWeather: currentWeather, // The currentWeather data is stored in the currentWeather variable
      forecast: forecast.list, // The forecast data is stored in the forecast variable
    };
  }

  function displayCurrentWeather(weather) { // Create a function called displayCurrentWeather that takes weather data as an argument
    // Display the current weather information
    $("#current-weather").html(`
      <h2>${weather.name} (${new Date().toLocaleDateString()})</h2>
      <img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}.png" alt="${weather.weather[0].description}" />
      <p>Temperature: ${weather.main.temp} °C</p>
      <p>Humidity: ${weather.main.humidity}%</p>
      <p>Wind Speed: ${weather.wind.speed} m/s</p>
    `); // The weather data is displayed in the current-weather div
  }

  function display5DayForecast(forecast) { // Create a function called display5DayForecast that takes forecast data as an argument
    const dailyForecasts = forecast.filter((entry) =>
      entry.dt_txt.endsWith("12:00:00") // Filter the forecast data to only include entries that end with 12:00:00
    ); // The filtered data is stored in a variable called dailyForecasts

    $("#forecast").empty();

    dailyForecasts.forEach((day) => { // Loop through the dailyForecasts array and run the following code inside the loop
      $("#forecast").append(`
        <div class="forecast-day">
          <h3>${new Date(day.dt_txt).toLocaleDateString()}</h3>
          <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}" />
          <p>Temperature: ${day.main.temp} °C</p>
          <p>Wind Speed: ${day.wind.speed} m/s</p>
          <p>Humidity: ${day.main.humidity}%</p>
        </div>
      `);
    }); // The dailyForecasts data is displayed in the forecast div
  }

  function addToSearchHistory(cityName) { // Create a function called addToSearchHistory that takes a cityName as an argument
    if (!searchHistory.includes(cityName)) { // If the searchHistory array does not include the cityName variable run the following code inside the if statement
      searchHistory.push(cityName); // Add the cityName variable to the searchHistory array

      $("#search-history").append(` 
        <button class="city-history">${cityName}</button>
      `); // Add a button to the search-history div with the cityName variable as the text
    }
  }
}); 
