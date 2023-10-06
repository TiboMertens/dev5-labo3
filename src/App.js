export default class App {
  constructor() {
    this.getLocation();
  }

  getLocation() {
    //bind this aan showPosition zodat je de betekenis van this meegeeft naar de volgende functie!!
    navigator.geolocation.getCurrentPosition(
      this.showPosition.bind(this),
      this.showError
    );
  }

  showPosition(position) {
    let x = position.coords.latitude;
    let y = position.coords.longitude;
    this.getWeather(x, y);
  }

  getWeather(x, y) {
    // url: https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m&current_weather=true&forecast_days=1
    // fetch, then log result
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=" +
        x +
        "&longitude=" +
        y +
        "&hourly=temperature_2m&current_weather=true&forecast_days=1"
    )
      .then((response) => response.json())
      .then((data) => {
        let temperature = data.current_weather.temperature;
        this.updateAdvertisement(temperature);
      })
      .catch((error) => console.log(error));
  }

  showError(error) {
    console.log(error);
  }

  updateAdvertisement(temperature) {
    let title = document.querySelector("h1");
    let img = document.querySelector("img");
    if (temperature >= 20) {
      title.innerHTML = `It's ${temperature} °C outside, perfect weather for an icecream!`;
      img.src = "images/ice.jpeg";
    } else if (temperature <= 10) {
      title.innerHTML = `It's ${temperature} °C outside, perfect weather for soup!`;
      img.src = "images/soup.jpg";
    } else {
      title.innerHTML = `It's ${temperature} °C outside, perfect weather for a salad!`;
      img.src = "images/salad.jpg";
    }
  }
}
