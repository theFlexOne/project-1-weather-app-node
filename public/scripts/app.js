const searchForm = document.querySelector('header form');
const searchBox = document.querySelector('#searchBox');
const userLocationButton = document.querySelector('#userLocationButton');


document.addEventListener("DOMContentLoaded", () => {
  sendUsersLatLon();

  searchForm.addEventListener('submit', fetchInputLocationData);
  userLocationButton.addEventListener('click',sendUsersLatLon);


});

const sendUsersLatLon = () => {
  if ("geolocation" in navigator) {
    console.log("geolocation available");
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      const { latitude: lat, longitude: lon } = coords;
      console.log(lat, lon);
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lat, lon }),
      };
      const data = await (await fetch("/api/weather", options)).json();
      displayWeather(data);
    });
  } else {
    console.log("geolocation not available");
  }

}

const dateStrObject = (() => {
  // let weekday, month, dayNum, year;
  const [weekday, month, dayNum, year] = new Date().toDateString().split(' ');
  // console.log(weekday, month, dayNum, year);
  return {weekday, month, dayNum, year} 
})();

const displayWeather = ({ weatherData }) => {
  console.log({ weatherData });
  const weatherCards = document.querySelector("main");
  const today = weatherData.daily[0],
    current = weatherData.current,
    sunrise = new Date(today.sunrise * 1000),
    sunset = new Date(today.sunset * 1000);

  // need the individual date pieces for styling as spans
  const { weekday, month, dayNum, year } = (() => {
    const [weekday, month, dayNum, year] = new Date().toDateString().split(" ");
    return { weekday, month, dayNum, year };
  })();

  const html = `
  <div class="card overview">
    <div class="location-and-date">
      <div class="title location">locationName</div>
      <div class="text date">
        <span class="weekday">${dateStrObject.weekday}</span>        
        <span>${dateStrObject.month} ${dateStrObject.dayNum}, ${dateStrObject.year}</span>        
      </div>
    </div>
    <div class="weather">
      <div class="image-wrapper">  
        <img
          src="http://openweathermap.org/img/wn/${
            current.weather[0].icon
          }@4x.png"
          class="image"
          alt="Weather description"
          title="${current.weather[0].description}"
        />
      </div>
      <div class="temp">
        ${Math.round(
          current.temp
        )}<span class="units">&degF</span>
      </div>
    </div>
  </div>  
  <div class="card description">
    <div class="body">
      <div class="high-low">
        Feels like high: ${today.feels_like.day}&deg;F
      </div>
      <div class="wind-rain"><span>${today.pop * 100}%</span><span>${today.wind_speed}m/s, ${
        today.wind_deg
      }&deg</span></div>
      <div class="sunrise-sunset">
        <span class="sunrise">Sunrise ${sunrise.getHours()}:${sunrise.getMinutes()} AM</span>
        <span class="sunset">
        Sunset ${
          sunset.getHours() > 12 ? sunset.getHours() - 12 : sunset.getHours()
        }:${sunset.getMinutes()} PM
        </span>
      </div>
    </div>
  </div>
  <div class="card five-day">5 Day Forecast</div>
  <div class="card hourly">Hourly Forecast</div>
  <div class="card other">Other</div>
  `;
  weatherCards.innerHTML = html;
};

const fetchInputLocationData = async (e) => {
  e.preventDefault();
  const location = searchBox.value;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({location}),
  };
  const data = await (await fetch("/api/location", options)).json()
  displayWeather(data);
}