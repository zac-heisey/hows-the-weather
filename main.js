// Get #local-weather container
var localWeather = document.querySelector('#local-weather');
// Get #weather-in container
var weatherIn = document.querySelector('#weather-in');
// Get location input field
var locationInput = document.querySelector('#locationInput');
// Weatherbit API
var apiKey = '7754743d740042859465c34d3ffc23c0';

/**
 * Sanitize and encode all HTML in a user-submitted string
 * @param  {String} str  The user-submitted string
 * @return {String} str  The sanitized string
 */
var sanitizeHTML = function (str) {
  var temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
};

// Get user location via ipapi API
function getUserLocation() {

  // Set up our HTTP request
  var xhr = new XMLHttpRequest();

  // Setup our listener to process request state changes
  xhr.onreadystatechange = function () {
    // Only run if the request is complete
    if (xhr.readyState !== 4) return;
    // Process our return data
    if (xhr.status >= 200 && xhr.status < 300) {
      // This will run when the request is successful
      getWeather(JSON.parse(xhr.responseText).city);
      // Set showWeather to #local-weather (left) container
      showWeather = localWeather;
    } else {
      // This will run when it's not
      console.log('There was an error retrieving data from the ipapi API. Here is the xhr.responseText info: ' + xhr.responseText);
    }
  };
  // Create and send a GET request
  // The first argument is the post type (GET, POST, PUT, DELETE, etc.)
  // The second argument is the endpoint URL
  xhr.open('GET', 'https://ipapi.co/json');
  xhr.send();

}

// Get weather based on user location via Weatherbit API
function getWeather(userLocation) {

  // Set up our HTTP request
  var xhr = new XMLHttpRequest();

  // Setup our listener to process request state changes
  xhr.onreadystatechange = function () {
    // Only run if the request is complete
    if (xhr.readyState !== 4) return;
    // Process our return data
    if (xhr.status >= 200 && xhr.status < 300) {
      // This will run when the request is successful
      var content = JSON.parse(xhr.responseText);
      var iconId = content.data[0].weather.icon;
      showWeather.innerHTML =
        '<h2>' + sanitizeHTML(content.data[0].city_name) + ', ' + sanitizeHTML(content.data[0].country_code) + '</h2>'
        + '<h3>' + sanitizeHTML(content.data[0].temp) + '°F / '
        + sanitizeHTML(Math.round((content.data[0].temp - 32) * 5/9)) + '°C</h3>'
        + '<img src="https://www.weatherbit.io/static/img/icons/' + iconId + '.png">'
        + '<p><strong>' + sanitizeHTML(content.data[0].weather.description) + '</strong></p>'
        + '<p>Feels Like: ' + sanitizeHTML(content.data[0].app_temp) + '°F / '
        + sanitizeHTML(Math.round((content.data[0].app_temp - 32) * 5/9)) + '°C</p>'
        + '<p>Humidity: ' + sanitizeHTML(content.data[0].rh) + '%</p>'
        + '<p>Wind Speed: ' + sanitizeHTML(content.data[0].wind_spd) + 'mph</p>'
        + '<p>Cloud Coverage: ' + sanitizeHTML(content.data[0].clouds) + '%</p>'
    } else {
      // This will run when it's not
      showWeather.textContent = 'Sorry, we\'re having trouble getting weather for your location. Please try again later.';
      console.log('There was an error retrieving data from the WeatherBit API. Here is the xhr.responseText info: ' + xhr.responseText);
    }
  };
  // Create and send a GET request
  // The first argument is the post type (GET, POST, PUT, DELETE, etc.)
  // The second argument is the endpoint URL
  xhr.open('GET', 'https://api.weatherbit.io/v2.0/current?city=' + userLocation + '&units=I&key=' + apiKey);
  xhr.send();

}

// Listen for keydown event on input field
locationInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    // If location input field value is empty
    if (locationInput.value.length > 0) {
      // Run getWeather function with user input city
      getWeather(locationInput.value);
      // Set showWeather to #weather-in (right) container
      showWeather = weatherIn;
    }
  }
}, false);

// Run application on initial page load
getUserLocation();
