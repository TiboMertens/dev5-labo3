export default class App {
  constructor() {
    this.getLocation();
  }

  getLocation() {
    //bind this aan showPosition zodat je de betekenis van this meegeeft naar de volgende functie!!
    navigator.geolocation.getCurrentPosition(this.showPosition.bind(this), this.showError);
  }

  showPosition(position) {
    let x = position.coords.latitude;
    let y = position.coords.longitude;
  }
}
