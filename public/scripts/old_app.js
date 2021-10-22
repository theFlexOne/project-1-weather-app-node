import getRdmMovieQuote from './movie-quotes.js'
import { OPEN_WEATHER_API_KEY, GOOGLE_API_KEY } from '../../api-keys.js';

const initApp = () => {
  
  //*variable declarations:
  const PLACES_API_ENDPOINT = "/api/places/"
  const OPEN_WEATHER_API_ENDPOINT = "https://api.openweathermap.org/data/2.5/onecall?"

  const searchForm = document.querySelector('header form');
  const searchBox = document.querySelector('#searchBox');
  const userLocationButton = document.querySelector('#userLocationButton');

  
  //*function declarations:


  const displayWeather = (weatherData, locationName) => {
    // console.log({ weatherData });
    const weatherCards = document.querySelector("main");
    const today = weatherData.daily[0],
      current = weatherData.current,
      sunrise = new Date(today.sunrise * 1000),
      sunset = new Date(today.sunset * 1000);



    const dateStrObject = (() => {
      // let weekday, month, dayNum, year;
      const [weekday, month, dayNum, year] = new Date().toDateString().split(' ');
      console.log(weekday, month, dayNum, year);
      return {weekday, month, dayNum, year} 
    })();

    const html = `
    <div class="card card-overview">
      <div class="location-and-date">
        <h1 class="card-title location">${locationName}</h1>
        <div class="card-text date">
          <span>${dateStrObject.weekday}</span>        
          <span>${dateStrObject.month} ${dateStrObject.dayNum}, ${dateStrObject.year}</span>        
        </div>
      </div>
      <div class="image-and-temp">
        <img
          src="http://openweathermap.org/img/wn/${
            current.weather[0].icon
          }@4x.png"
          class="card-img"
          alt="Weather description"
          title="${current.weather[0].description}"
        />
        <span>
          ${Math.round(
            current.temp
          )}°<span class="degree-units-system">F</span>
        </span>
      </div>
    </div>  
    <div class="card card-info">
      <div class="card-body">
        <p class="card-text high-low-feels">
          Feels like high: ${today.feels_like.day}&deg;F
        </p>
        <p class="card-text">Precipitation ${today.pop * 100}%</p>
        <p class="card-text">Wind ${today.wind_speed}m/s, ${
      today.wind_deg
    }&deg;</p>
        <p class="card-text">
          Sunrise ${sunrise.getHours()}:${sunrise.getMinutes()} AM
        </p>
        <p class="card-text">
          Sunset ${
            sunset.getHours() > 12 ? sunset.getHours() - 12 : sunset.getHours()
          }:${sunset.getMinutes()} PM
        </p>
      </div>
    </div>
    <div class="card card-three-day">3 Day Forecast</div>
    <div class="card card-five-day">5 Day Forecast</div>
    <div class="card card-other">Other</div>
    `;
    weatherCards.innerHTML = html;
  };
  const fetchWeather = (lat, lon, locationName = "LOCATION NAME") => {
    const units = "imperial";
    const url = `${OPEN_WEATHER_API_ENDPOINT}lat=${lat}&lon=${lon}&units=${units}&lang=en&appid=${OPEN_WEATHER_API_KEY}`;
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(weatherData => displayWeather(weatherData, locationName))
      .catch(console.error);
  };

  const fetchInputLocationData = (e) => {
    const input = searchBox.value;
    const url = `${PLACES_API_ENDPOINT}?input=${input}&fields=name%2Cgeometry%2Cplace_id&inputtype=textquery&key=${GOOGLE_API_KEY}`;
    e.preventDefault();
    searchForm.reset();
    console.log(input);
    // debugger;
    if (input === "") return fetchUserLocationData();
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(data => {
        console.log(data);
        const lat = data.candidates[0].geometry.location.lat.toPrecision(4);
        const lon = data.candidates[0].geometry.location.lng.toPrecision(4);
        const locationName = data.candidates[0].formatted_address;
        return fetchWeather(lat, lon, locationName);
      })
      .catch(error => console.error(error));
  };

  const fetchUserLocationName = (lat, lon) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=44.805331745443546,-95.53558784405938&key=${GOOGLE_API_KEY}`
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(data => {
        console.log(data);
        const addressComponents = data.results.find(result => {
          if (result.types[0] === "locality" && 
              result.types[1] === "political" && 
              result.types.length === 2) {
            return true;
          }
        }).address_components;
        console.log(addressComponents);
        const locationName = {specificLocation: addressComponents[0].long_name, broadLocation: addressComponents[2].long_name}
        // locationName = locationName.concat(addressComponents[0].long_name + ", " + addressComponents[2].long_name);
        // locationName = locationName.split(', ').join(' </br> ');
        return fetchWeather(lat, lon, locationName);
      })
      .catch(console.error);
  };
  const fetchUserLocationData = () => {
    // debugger
    const success = position => {
      let { latitude: lat, longitude: lon } = position.coords;
      return fetchUserLocationName(lat, lon);
    };
    const error = error => console.error(error);
    navigator.geolocation.getCurrentPosition(success, error);
  };

  const displayRdmMovieQuotes = () => {
    const movieQuote = document.querySelector('#movieQuote');
    movieQuote.innerHTML = getRdmMovieQuote();
  }

  //*event listeners:

  searchForm.addEventListener('submit', fetchInputLocationData);
  userLocationButton.addEventListener('click',fetchUserLocationData);


  fetchUserLocationData();
  displayRdmMovieQuotes();
  // searchBox.focus();


}

// document.addEventListener('DOMContentLoaded', initApp);
initApp();
