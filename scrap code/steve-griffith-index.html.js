let tempWeatherData;
const app = {
  init: () => {},

  fetchCabinWeather: (lang = "en") => {
    //* Fetch weather for cabin:
    //*     Latitude:   46.23
    //*     Longitude: -94.32
    //* Default language is English, but a Swedish option is available:
    //*     English: "en" || Swedish = "sv"
    let API_KEY = "6fbfff15f75b941ce268d9ce6b344f79";
    let units = "imperial";
    let url = `https://api.openweathermap.org/data/2.5/onecall?lat=46.23&lon=-94.32&units=${units}&appid=${API_KEY}&lang=${lang}`;

    fetch(url)
      .then((resp) => {
        if (!resp.ok) throw new Error(resp.statusText);
        return resp.json(); // <-- is now 'data' //
      })
      .then((data) => app.showWeather(data))
      .catch(console.err);
  },

  showWeather: (weatherData) => {
    tempWeatherData = weatherData;
    const current = weatherData.current;
    const today = weatherData.daily[0];
    const date = new Date(current.dt * 1000).toDateString();
    const sr = new Date(today.sunrise * 1000);
    const ss = new Date(today.sunset * 1000);
    const cabinHTMLElements = document.querySelector(".collumn.cabin");
    const replacementCabinHTML = ` 
            <div class="card cabin" style="width: 30%">
                <h1 class="card-title location">Crow Wing Lake</h1>
                <h5 class="card-text date">${date}</h5>
                <img src="http://openweathermap.org/img/wn/${
                  current.weather[0].icon
                }@4x.png" class="card-img"
                    alt="Weather description" title="${
                      current.weather[0].description
                    }" />
                <div class="card-body">
                    <h3 class="card-title card-text">${
                      current.weather[0].main
                    }</h3>
                    <p class="card-text high-low-temp">High ${
                      today.temp.max
                    }&deg;F Low ${today.temp.min}&deg;F</p>
                    <p class="card-text high-low-feels">Feels like high: ${
                      today.feels_like.day
                    }&deg;F</p>
                    <p class="card-text">Precipitation ${today.pop * 100}%</p>
                    <p class="card-text">Wind ${today.wind_speed}m/s, ${
      today.wind_deg
    }&deg;</p>
                    <p class="card-text">Sunrise ${sr.getHours()}:${sr.getMinutes()} AM</p>
                    <p class="card-text">Sunset ${
                      ss.getHours() > 12 ? ss.getHours() - 12 : ss.getHours()
                    }:${ss.getMinutes()} PM</p>
                </div>
            </div>
        `;
    console.log(replacementCabinHTML);
    cabinHTMLElements.innerHTML = replacementCabinHTML;
    console.log(cabinHTMLElements);
  },

  //     let row = document.querySelector('.weather.row');
  //     //* clear out the old weather and add the new
  //     let date = new Date(resp.current.dt * 1000); //converts dt property of weather object to a javascript date
  //     let sunrise = new Date(resp.current.sunrise * 1000).toTimeString();
  //     let sunset = new Date(resp.current.sunset * 1000).toTimeString();
  //     let innerHTML = document.querySelector('.col.cabin').innerHTML;
  //     let img = resp.current.weather[0].icon;
  //     console.log(innerHTML);
  //     console.log(img);

  //     innerHTML = `
  //         <div class="card cabin" style="width: 500px">
  //             <h1 class="crow-wing-lake">Crow Wing Lake</h1>
  //             <h5 class="card-title p-2">Date</h5>
  //             <img src="http://openweathermap.org/img/wn/${img}@4x.png" class="card-img-top"
  //                 alt="Weather description" />
  //             <div class="card-body">
  //                 <h3 class="card-title">Weather Label</h3>
  //                 <p class="card-text">High Temp Low Temp</p>
  //                 <p class="card-text">HighFeels like</p>
  //                 <p class="card-text">Pressure</p>
  //                 <p class="card-text">Humidty</p>
  //                 <p class="card-text">UV Index</p>
  //                 <p class="card-text">Precipitation</p>
  //                 <p class="card-text">Dew Point</p>
  //                 <p class="card-text">Wind speed and direction</p>
  //                 <p class="card-text">Sunrise</p>
  //                 <p class="card-text">Sunset</p>
  //             </div>
  //         </div>
  //     `
  // }
};

// app.init();

app.fetchCabinWeather();

/* const app = {
    init: () => {
        document
            .getElementById('btnGet')
            .addEventListener('click', app.fetchWeather);
        document
            .getElementById('btnCurrent')
            .addEventListener('click', app.getLocation);
    },
    fetchWeather: (ev) => {
        //use the values from latitude and longitude to fetch the weather
        let lat = document.getElementById('latitude').value;
        let lon = document.getElementById('longitude').value;
        let key = '06cc7efd0e5386068ec3c390bcfd0183';
        let lang = 'en';
        let units = 'metric';
        let url = `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${key}&units=${units}&lang=${lang}`;
        //fetch the weather
        fetch(url)
            .then((resp) => {
                if (!resp.ok) throw new Error(resp.statusText);
                return resp.json();
            })
            .then((data) => {
                app.showWeather(data);
            })
            .catch(console.err);
    },
    getLocation: (ev) => {
        let opts = {
            enableHighAccuracy: true,
            timeout: 1000 * 10, //10 seconds
            maximumAge: 1000 * 60 * 5, //5 minutes
        };
        navigator.geolocation.getCurrentPosition(app.ftw, app.wtf, opts);
    },
    ftw: (position) => {
        //got position
        document.getElementById('latitude').value =
            position.coords.latitude.toFixed(2);
        document.getElementById('longitude').value =
            position.coords.longitude.toFixed(2);
    },
    wtf: (err) => {
        //geolocation failed
        console.error(err);
    },
    showWeather: (resp) => {
        console.log(resp);
        let row = document.querySelector('.weather.row');
        //clear out the old weather and add the new
        // row.innerHTML = '';
        row.innerHTML = resp.daily
            .map((day, idx) => {
                if (idx <= 2) {
                    let dt = new Date(day.dt * 1000); //timestamp * 1000
                    let sr = new Date(day.sunrise * 1000).toTimeString();
                    let ss = new Date(day.sunset * 1000).toTimeString();
                    return `<div class="col">
                <div class="card">
                <h5 class="card-title p-2">${dt.toDateString()}</h5>
                  <img
                    src="http://openweathermap.org/img/wn/${
                      day.weather[0].icon
                    }@4x.png"
                    class="card-img-top"
                    alt="${day.weather[0].description}"
                  />
                  <div class="card-body">
                    <h3 class="card-title">${day.weather[0].main}</h3>
                    <p class="card-text">High ${day.temp.max}&deg;C Low ${
              day.temp.min
            }&deg;C</p>
                    <p class="card-text">High Feels like ${
                      day.feels_like.day
                    }&deg;C</p>
                    <p class="card-text">Pressure ${day.pressure}mb</p>
                    <p class="card-text">Humidity ${day.humidity}%</p>
                    <p class="card-text">UV Index ${day.uvi}</p>
                    <p class="card-text">Precipitation ${day.pop * 100}%</p>
                    <p class="card-text">Dewpoint ${day.dew_point}</p>
                    <p class="card-text">Wind ${day.wind_speed}m/s, ${
              day.wind_deg
            }&deg;</p>
                    <p class="card-text">Sunrise ${sr}</p>
                    <p class="card-text">Sunset ${ss}</p>
                  </div>
                </div>
              </div>
            </div>`;
                }
            })
            .join(' ');
    },
};

app.init(); */
