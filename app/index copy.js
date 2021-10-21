const cabinWeatherApp = {
  fetchCabinWeather: (lang = "en") => {
    //* Default language is English, but a Swedish option is available:
    //*     English: "en" || Swedish = "sv"
    let API_KEY = "6fbfff15f75b941ce268d9ce6b344f79";
    let units = "imperial";
    let url = `https://api.openweathermap.org/data/2.5/onecall?lat=46.23&lon=-94.32&units=${units}&appid=${API_KEY}&lang=${lang}`;

    fetch(url)
      .then(resp => {
        if (!resp.ok) throw new Error(resp.statusText);
        return resp.json();
      })
      .then(data => cabinWeatherApp.displayWeather(data))
      .catch(console.error);
  },
  displayWeather: weatherData => {
    const {current, daily: {0: today}} = weatherData;
    // console.log(JSON.stringify({current, daily: {0: today}}));
    // sessionStorage.setItem('weatherData', )
    console.log({current}, {today});
    const date = new Date(current.dt * 1000).toDateString();
    const sunrise = new Date(today.sunrise * 1000);
    const sunset = new Date(today.sunset * 1000);
    const weatherCards = document.querySelector(".weather-cards-container")
    const html = `<div class="card overview">
    <h1 class="card-title location">Crow Wing Lake</h1>
    <h5 class="card-text date">${date}</h5>
    <img
      src="http://openweathermap.org/img/wn/${current.weather[0].icon}@4x.png"
      class="card-img"
      alt="Weather description"
      title="${current.weather[0].description}"
    />
    <div class="card-body">
      <h3 class="card-title card-text">${current.weather[0].main}</h3>
      <p class="card-text high-low-temp">
        High ${today.temp.max}&deg;F Low ${today.temp.min}&deg;F
      </p>
      <p class="card-text high-low-feels">
        Feels like high: ${today.feels_like.day}&deg;F
      </p>
      <p class="card-text">Precipitation ${today.pop * 100}%</p>
      <p class="card-text">
        Wind ${today.wind_speed}m/s, ${today.wind_deg}&deg;
      </p>
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
    <div class="card info">Info</div>
    <div class="card three-day">3 Day Forcast</div>
    <div class="card five-day">5 Day Forcast</div>
    <div class="card other">Other</div>`;
    weatherCards.innerHTML = html;
  }

};

cabinWeatherApp.fetchCabinWeather();
