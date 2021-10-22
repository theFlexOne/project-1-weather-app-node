const express = require('express');
const app = express();
const fetch = require('node-fetch')

app.listen(3000, (req, res) => console.log("Up at localhost:3000"));
app.use(express.static('public'));
app.use(express.json());



app.post('/api', async (req, res) => {
  console.log("Request received");
  const {lat, lon} = req.body;
  weatherData = await fetchWeather(lat, lon);
  console.log(weatherData);
  res.json({
    status: "success",
    weatherData,
  });
});



const fetchWeather = async (lat, lon) => {
  console.log(lat, lon);
  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=37fc3c7b9cfbdc5c99764ee1486ef34d`
  const response = await fetch(url);
  const data = await response.json();
  // console.log(data);
  return data;
};

