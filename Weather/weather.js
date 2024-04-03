import { getLocation } from "../JS/LocationDetails.js";

function getDirection(degree) {
  const directions = [
    "North",
    "North-Northeast",
    "Northeast",
    "East-Northeast",
    "East",
    "East-Southeast",
    "Southeast",
    "South-Southeast",
    "South",
    "South-Southwest",
    "Southwest",
    "West-Southwest",
    "West",
    "West-Northwest",
    "Northwest",
    "North-Northwest",
  ];
  const index = Math.round(
    ((degree %= 360) < 0 ? degree + 360 : degree) / 22.5
  );
  return directions[index % 16];
}

async function showWeather() {
  var location = await getLocation();

  addElement("h1", `Weather for ${location.city}, ${location.state}:`);
  addElement("br", ``);

  addElement("h3", `Precipitation: ${location.weather.precipitation} inches`);
  addElement("h3", `Temperature: ${location.weather.temperature_2m}°F`);
  addElement("h3", `Feels Like: ${location.weather.apparent_temperature}°F`);
  addElement("h3", `Cloud Cover: ${location.weather.cloud_cover}%`);
  addElement("h3", `Humidity: ${location.weather.relative_humidity_2m}%`);

  addElement(
    "h3",
    `Wind: ${getDirection(location.weather.wind_direction_10m)} at ${
      location.weather.wind_speed_10m
    } mph`
  );

  addElement("br", ``);

  document.getElementById("map").style =
    "width: 75vw; height: 75vh; border-radius: 5px;";

  var southWest = L.latLng(24.396308, -125.0), // Southwest coordinates
    northEast = L.latLng(49.384358, -66.93457), // Northeast coordinates
    bounds = L.latLngBounds(southWest, northEast); // Bounds for continental United States

  var map = L.map("map", {
    maxBounds: bounds,
    maxZoom: 18,
    minZoom: 3,
  }).setView([location.latitude, location.longitude], 5);

  var marker = L.marker([location.latitude, location.longitude]).addTo(map);
  marker.bindPopup("Your Location");

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  var radarLayer = L.tileLayer
    .wms("https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi", {
      layers: "nexrad-n0r-900913",
      format: "image/png",
      transparent: true,
      opacity: 0.6,
    })
    .addTo(map);
}

showWeather();

function addElement(type, innerHTML) {
  let element = document.createElement(type);
  element.innerHTML = innerHTML;

  document.getElementById("weatherInfo").appendChild(element);
}
