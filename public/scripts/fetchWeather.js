const OPEN_WEATHER_API_ENDPOINT = "https://api.openweathermap.org/data/2.5/onecall?";
const OPEN_WEATHER_API_KEY = "37fc3c7b9cfbdc5c99764ee1486ef34d";

export const fetchWeather = (lat, lon, locationName = "LOCATION NAME") => {
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
