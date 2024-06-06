"use strict";

window.onload = () => {
  let citiesDropdown = document.querySelector("#citiesDropdown");
  initCitiesDropdown();

  citiesDropdown.addEventListener("change", displayTable);
};

//Here we will do the work for api
async function displayTable() {
  let citiesDropdown = document.querySelector("#citiesDropdown");
  let userSelectedCity = citiesDropdown.value;
  console.log(userSelectedCity);
  let cor_latitude = getLatitude(userSelectedCity);
  let cor_longitude = getLongitude(userSelectedCity);

  let response = await fetch(
    `https://api.weather.gov/points/${cor_latitude},${cor_longitude}`,
    {}
  );

  let data = await response.json();
  let forecastData = await getWeatherData(data.properties.forecast);

  let forecastWithPeriods = forecastData.properties.periods;
  //console.log(forecastData.properties.periods);
  //console.log(forecastWithPeriods);
  let tableBody = document.querySelector("#tableBody");
  tableBody.innerHTML = "";
  forecastWithPeriods.forEach((subForecast) => {
    tableForResult(tableBody, subForecast);
  });
}

async function getWeatherData(URL) {
  let response = await fetch(URL);
  let data = await response.json();
  return data;
}

//This is the function that will populate the cities
function initCitiesDropdown() {
  let citiesDropdown = document.querySelector("#citiesDropdown");
  let defaultOption = document.createElement("option");
  defaultOption.textContent = "-- Select a City --";
  defaultOption.value = "";
  citiesDropdown.appendChild(defaultOption);

  //we will populate all the city in the dropdown menu from the array
  cities.forEach((city) => {
    let newOption = document.createElement("option");
    newOption.innerText = city.name;
    newOption.value = city.name;
    citiesDropdown.appendChild(newOption);
  });
}

//Here I will use function to get the latitude and longitude
//this function will get the latitude
function getLatitude(userSelectedCity) {
  let city = cities.find(
    (city) => userSelectedCity.toLowerCase() === city.name.toLowerCase()
  );
  if (city) {
    return city.latitude;
  }
}

//this function will get the longitude
function getLongitude(userSelectedCity) {
  let city = cities.find(
    (city) => userSelectedCity.toLowerCase() === city.name.toLowerCase()
  );
  if (city) {
    return city.longitude;
  }
}

//this builds the table
function tableForResult(tableBody, userData) {
  let newRow = tableBody.insertRow();
  let cell1 = newRow.insertCell();
  cell1.innerHTML = userData.name;

  let cell2 = newRow.insertCell();
  cell2.innerHTML = `Temperature: ${userData.temperature}`;

  let cell3 = newRow.insertCell();
  cell3.innerHTML = `deg ${userData.temperatureUnit}`;

  let cell4 = newRow.insertCell();
  cell4.innerHTML = `Wind: ${userData.windDirection}`;

  let cell5 = newRow.insertCell();
  cell5.innerHTML = userData.windSpeed;

  let cell6 = newRow.insertCell();
  cell6.innerHTML = userData.detailedForecast;
}
