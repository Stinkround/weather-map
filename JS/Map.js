var radarLayer;
var map;

import { getLocation } from "./LocationDetails.js";

function addWeatherLayer(map) {
  radarLayer = L.tileLayer
    .wms("https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi", {
      layers: "nexrad-n0r-900913",
      format: "image/png",
      transparent: true,
      opacity: 0.6,
    })
    .addTo(map);
}

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

//create the map itself

async function createMap() {
  var location = await getLocation();

  document.getElementById("map").style = "";
  document.getElementById("h1").style = "display: none;";

  //makes user always look at the USA
  var southWest = L.latLng(24.396308, -125.0), // Southwest coordinates
    northEast = L.latLng(49.384358, -66.93457), // Northeast coordinates
    bounds = L.latLngBounds(southWest, northEast); // Bounds for continental United States

  map = L.map("map", { maxBounds: bounds, maxZoom: 18, minZoom: 3 }).setView(
    [location.latitude, location.longitude],
    5
  );

  var marker = L.marker([location.latitude, location.longitude]).addTo(map);

  // Bind a popup to the marker with the weather data
  marker
    .bindPopup(
      `<h3>Your Location:</h3>` +
        `<h4>${location.city}, ${location.state}</h4>` +
        `<br> <strong style="text-decoration: underline; cursor: pointer;" onclick="window.open('/weather/weather.html', '_blank')">More Info..</strong>`
    )
    .openPopup();

  //add main layer

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  //add marker where location of user is
  // Make a request to the Open-Meteo API

  // Add the radar overlay
  addWeatherLayer(map);

  // Create a legend and add it to the map
  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "info legend"),
      labels = ["<strong>Weather Legend</strong>"],
      categories = [
        { label: "Light Rain", color: "blue" },
        { label: "Rain", color: "green" },
        { label: "Moderate Rain", color: "yellow" },
        { label: "Heavy Rain", color: "red" },
        { label: "Extremely Heavy Rain", color: "purple" },
        { label: "Freezing Rain/Sleet", color: "pink" },
      ];

    // Generate a label with a colored square for each category
    for (var i = 0; i < categories.length; i++) {
      labels.push(
        '<i style="background:' +
          categories[i].color +
          '; width: 10px; height: 10px; display: inline-block;"></i> ' +
          categories[i].label
      );
    }

    div.innerHTML = labels.join("<br>");
    return div;
  };

  legend.addTo(map);

  //update weather every 5 seconds
  setInterval(function () {
    map.removeLayer(radarLayer);
    addWeatherLayer(map);
  }, 5000);
}

export { createMap };
