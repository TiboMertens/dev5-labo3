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
        this.getRandomMeal(temperature);

        // Store the new data in localStorage with a timestamp
        const currentTime = new Date().getTime();
        localStorage.setItem(
          storageKey,
          JSON.stringify({ timestamp: currentTime, data })
        );
      })
      .catch((error) => console.log(error));
  }

  getRandomMeal(temperature) {
    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
      .then((response) => response.json())
      .then((data) => {
        // Handle the random meal data here, e.g., display it or use it in your application.
        let meal = data.meals[0].strMealThumb // Access the random meal data
        this.updateAdvertisement(temperature, meal);
        // You can also update your UI or perform further actions with the meal data here.
      })
      .catch((error) => console.log(error));
  }

  showError(error) {
    console.log(error);
  }

  updateAdvertisement(temperature, meal) {
    let title = document.querySelector("h1");
    let img = document.querySelector("img");
    let temp = temperature;
    let mealImg = meal;
    title.innerHTML = "Het is " + temp + " graden, perfect voor deze maaltijd!";
    img.src = mealImg;
    img.style.width = "300px";
    img.style.height = "300px";
  }
}
