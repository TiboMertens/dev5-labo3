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
    const storageKey = "weatherData";
    const storedData = localStorage.getItem(storageKey);

    if (storedData) {
      const { timestamp, data } = JSON.parse(storedData);
      const currentTime = new Date().getTime();

      // Check if the stored data is less than an hour old (3600000 milliseconds = 1 hour)
      if (currentTime - timestamp < 3600000) {
        this.updateAdvertisement(data.current_weather.temperature);
        return; // Use stored data and exit the function
      }
    }

    // If stored data doesn't exist or is outdated, make a new API call
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${x}&longitude=${y}&hourly=temperature_2m&current_weather=true&forecast_days=1`
    )
      .then((response) => response.json())
      .then((data) => {
        let temperature = data.current_weather.temperature;
        this.updateAdvertisement(temperature);

        // Store the new data in localStorage with a timestamp
        const currentTime = new Date().getTime();
        localStorage.setItem(
          storageKey,
          JSON.stringify({ timestamp: currentTime, data })
        );
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
