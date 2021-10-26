const express = require("express");
const app = express();
const fetch = require("node-fetch");

const OPEN_WEATHER_API_KEY = '37fc3c7b9cfbdc5c99764ee1486ef34d'
const GOOGLE_API_KEY = "AIzaSyCMNhm78jy8Z_PGj1nAKmWPfICcULLsWRA";

const OPEN_WEATHER_API_ENDPOINT = 'https://api.openweathermap.org/data/2.5/onecall?'
const PLACES_API_ENDPOINT = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?"


app.listen(3000, (req, res) => console.log("Up at localhost:3000"));
app.use(express.static("public"));
app.use(express.json());

app.post("/api/weather", async (req, res) => {
  console.log("Request received");
  const { lat, lon } = req.body;
  const weatherData = await fetchWeather(lat, lon);
  // const location = 
  console.log("Returning the weather");
  res.json({
    status: "success",
    weatherData
  });
});

app.post("/api/location", async (req, res) => {
  console.log("Request received");
  const locationInput = req.body.location;
  const locationData = await fetchLocation(locationInput);
  res.json({
    status: "success",
    locationData
  });

})

// app.post("/temp", (req, res) => {
//   console.log("Request received");
//   console.log(req.body.movieQuotes.length);
//   const data = req.body;
//   fs.writeFile("./db.json", JSON.stringify(data), () => {});
//   res.json({
//     status: "success",
//     message: `All ${data.movieQuotes.length} quotes posted!`
//   })
// })

const fetchWeather = async (lat, lon) => {
  console.log("Fetching the weather");
  const url = OPEN_WEATHER_API_ENDPOINT + `lat=${lat}&lon=${lon}&units=imperial&appid=${OPEN_WEATHER_API_KEY}`;
  try {
    const data = await (await fetch(url)).json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

const fetchLocation = async (input) => {
  console.log("Fetching user location");
  const url = `${PLACES_API_ENDPOINT}input=${input}&fields=name,geometry,place_id&inputtype=textquery&key=${GOOGLE_API_KEY}`;
  const data = await (await fetch(url)).json();
  console.log(data);
  return data;

}