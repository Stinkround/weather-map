async function getLocation() {
  var location = await new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition((position) =>
      resolve({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      })
    );
  });

  // Fetch weather data for the current location
  var weatherResponse = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${
      location.latitude
    }&longitude=${
      location.longitude
    }&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,cloud_cover,surface_pressure,wind_speed_10m,wind_direction_10m&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=${
      Intl.DateTimeFormat().resolvedOptions().timeZone
    }`
  );

  console.log(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}`
  );
  var weatherData = await weatherResponse.json();

  // Fetch city name and state for the current location
  var geocodeResponse = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}`
  );
  var geocodeData = await geocodeResponse.json();

  // Add the weather data and city name and state to the location object
  location.weather = weatherData.current;
  location.address = `${geocodeData.name}, ${geocodeData.address.house_number} ${geocodeData.address.road}`;
  location.city = geocodeData.address.city || geocodeData.address.town;
  location.state = geocodeData.address.state;

  return location;
}

export { getLocation };
