// import { fetchWeather } from "./fetchWeather.js"

document.addEventListener("DOMContentLoaded", () => {
  if ("geolocation" in navigator) {
    console.log("geolocation available");
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const { latitude: lat, longitude: lon } = coords;
      console.log(lat, lon);
      const options = {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({lat, lon})
      };
      fetch("/api", options)
        .then(res => res.json())
        .then(data => displayWeather(data))
        .catch(err => console.error(err))
    });
  } else {
    console.log("geolocation not available");
  }
});

const displayWeather = ({ weatherData }) => {
  console.log({ weatherData });
  const weatherCards = document.querySelector("main");
  const today = weatherData.daily[0],
    current = weatherData.current,
    sunrise = new Date(today.sunrise * 1000),
    sunset = new Date(today.sunset * 1000);

  // need the individual date pieces for styling as spans
  const {weekday, month, dayNum, year} = (() => {
    const [weekday, month, dayNum, year] = new Date().toDateString().split(' ');
    return {weekday, month, dayNum, year} 
  })();

  const html = `
  <div class="card card-overview">
    <div class="location-and-date">
      <h1 class="card-title location">**INSERT LOCATION NAME HERE**</h1>
      <div class="card-text date">
        <span>${weekday}</span>        
        <span>${month} ${dayNum}, ${year}</span>        
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
