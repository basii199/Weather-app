let lat ;
let lon ;

//DOM
let cityText = document.querySelector('.city-text')
let temperatureText = document.querySelector('.temperature-text')
let currentWeatherImage = document.querySelector('.image-div')

let currentWeather
let forecastWeather

async function success (position) {
  lat = position.coords.latitude
  lon = position.coords.longitude

  await getWeather()
  await forecast()
  renderCurrentWeather()
  render24hourforecast()
}

function error (){
  console.log('no location data')
}

const options = {
  enableHighAccuracy: true,
} 

navigator.geolocation.getCurrentPosition(success, error, options)



async function getWeather (){
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=8586b43ac9581dbd1b6a690da7b0e08f`  

  const response = await fetch(url)

  currentWeather = await response.json()

  console.log(currentWeather)
}

async function forecast (){
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=8586b43ac9581dbd1b6a690da7b0e08f`  

  const response = await fetch(url)

  forecastWeather = await response.json()

  console.log(forecastWeather)
}

function renderCurrentWeather (){
  console.log(currentWeather.weather[0].icon)
  cityText.innerText = currentWeather.name
  temperatureText.innerText = Math.round(currentWeather.main.temp) - 273
  currentWeatherImage.innerHTML = `<img src="https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png">`
}

function render24hourforecast (){
  for(let i = 0; i< 8; i++){
    let time = forecastWeather.list[i].dt_txt.split(' ')[1].slice(0, 5)
    document.querySelector(`.time-${i}`).innerText = time

    let image = forecastWeather.list[i].weather[0].icon
    document.querySelector(`.image-${i}`).src = `https://openweathermap.org/img/wn/${image}@2x.png`

    let temp = Math.round(forecastWeather.list[i].main.temp) - 273
    document.querySelector(`.temp-${i}`).innerText = temp
  }  
}


