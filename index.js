const express = require('express');
const app = express();

app.listen(3000, (req, res) => console.log("Up at localhost:3000"));
app.use(express.static('public'));
app.use(express.json());

app.post('/api', (req, res) => {
  console.log("Request received");
  const {lat, lon} = req.body;
  // const weatherData = fetchWeather(lat, lon)
  // console.log(weatherData);
  res.json({
    status: "success",
    lat,
    lon
  });
});

const fetchWeather = (lat, lon) => {
  const OPEN_WEATHER_API_ENDPOINT = "https://api.openweathermap.org/data/2.5/onecall?";
  const OPEN_WEATHER_API_KEY = "37fc3c7b9cfbdc5c99764ee1486ef34d";
  const units = "imperial";
  const url = `${OPEN_WEATHER_API_ENDPOINT}lat=${lat}&lon=${lon}&units=${units}&lang=en&appid=${OPEN_WEATHER_API_KEY}`;
  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    })
    .then(weatherData => weatherData)
    .catch(console.error);
};
