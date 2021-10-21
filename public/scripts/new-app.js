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
      fetch("/api", options);
    });
  } else {
    console.log("geolocation not available");
  }
});
