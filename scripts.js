let lat ;
let lon ;

//DOM
let cityText = document.querySelector('.city-text')
let temperatureText = document.querySelector('.temperature-text')
let currentWeatherImage = document.querySelector('.image-div')
let searchBar = document.querySelector('.search-bar')

let currentWeather
let forecastWeather

navigator.geolocation.getCurrentPosition(success, error)

function success (position) {
  lat = position.coords.latitude
  lon = position.coords.longitude

  displayWeather()
}

function error (){
  searchCity('lagos')
  console.log('no location data')
}

async function displayWeather () {
  await getWeather()
  renderCurrentWeather()
  await forecast()
  render24hourforecast()
}

async function getWeather (){
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=8586b43ac9581dbd1b6a690da7b0e08f`  

  const response = await fetch(url)

  currentWeather = await response.json()
}

async function forecast (){
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=8586b43ac9581dbd1b6a690da7b0e08f`  

  const response = await fetch(url)

  forecastWeather = await response.json()
}

function renderCurrentWeather (){
  cityText.innerText = currentWeather.name
  temperatureText.innerText = `${Math.round(currentWeather.main.temp) - 273}°`
  currentWeatherImage.innerHTML = `<img src="https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png">`
}

function render24hourforecast (){
  for(let i = 0; i< 8; i++){
    let time = forecastWeather.list[i].dt_txt.split(' ')[1].slice(0, 5)
    document.querySelector(`.time-${i}`).innerText = time

    let image = forecastWeather.list[i].weather[0].icon
    document.querySelector(`.image-${i}`).src = `https://openweathermap.org/img/wn/${image}@2x.png`

    let temp = Math.round(forecastWeather.list[i].main.temp) - 273
    document.querySelector(`.temp-${i}`).innerText = `${temp}°`
  }  
}

async function searchCity(city){
  const url1 = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=8586b43ac9581dbd1b6a690da7b0e08f`

  const url2 = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=8586b43ac9581dbd1b6a690da7b0e08f`

  try {
    const response1 = await fetch(url1)
    currentWeather = await response1.json()

    const response2 = await fetch(url2)
    forecastWeather = await response2.json()

    if (currentWeather.cod == '200') {
      renderCurrentWeather()
      render24hourforecast()
    } else (
      alert('Error finding city')
    )
  }   

  catch {
    alert('An error occured, try again')
  }  
}

searchBar.addEventListener('keydown', (e)=>{
  if(e.key == 'Enter'){
     searchCity(searchBar.value)
     searchBar.value = ''
  }
})