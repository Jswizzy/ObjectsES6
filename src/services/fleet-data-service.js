import {Car} from "../classes/car.js";
import {Drone} from "../classes/drone.js";
import {DataError} from "./data-error.js";

export class FleetDataService {

  constructor() {
    this.cars = [];
    this.drones = [];
    this.errors = [];
  }

  loadData(fleet) {
    for (let data of fleet) {
      switch(data.type) {
        case 'car':
          if (this.validateCarData(data)) {
            let car = this.loadCar(data);
            if (car)
              this.cars.push(car);
          } else {
            let e = new DataError('invalid car data', data);
            this.errors.push(e);
          }
          break;
        case 'drone':
          if (this.validateDroneData(data)) {
            let drone = this.loadDrone(data);
            if (drone)
              this.drones.push(drone);
          } else {
            let e = new DataError('invalid drone data', data);
            this.errors.push(e);
          }
          break;
        default:
          let e = new DataError('Invalid vehicle type', data);
          this.errors.push(e);
      }
    }
  }

  loadCar(car) {
    try {
      let c = new Car(car.license, car.model, car.latLong);
      c.miles = car.miles;
      c.make = car.make;
      return c;
    } catch (e) {
      this.errors.push(new DataError('error loading car', car));
    }
    return null;
  }

  loadDrone(drone) {
    try {
      let d = new Drone(drone.license, drone.model, drone.latLong);
      d.airTimeHours = drone.airTimeHours;
      d.base = drone.base;
      return d;
    } catch (e) {
      this.errors.push(new DataError('error loading drone', drone));
    }
  }

  validateCarData(car) {
    let requiredProps = 'license model latLong miles make'.split(' ');
    let hasErrors = false;

    for (let field of requiredProps) {
      if (!car[field]) {
        hasErrors = true;
        this.errors.push(new DataError(`invalid field ${field}`, car));
      }
    }

    if (Number.isNaN(Number.parseFloat(car.miles))) {
      hasErrors = true;
      this.errors.push(new DataError(`invalid millage ${car.miles}`, car))
    }

    return !hasErrors;
  }

  validateDroneData(drone) {
    let requiredProps = 'license model latLong airTimeHours base'.split(' ');
    let hasErrors = false;

    for (let field of requiredProps) {
      if (!drone[field]) {
        hasErrors = true;
        this.errors.push(new DataError(`invalid field ${field}`, drone));
      }
    }

    if (Number.isNaN(Number.parseFloat(drone.airTimeHours))) {
      hasErrors = true;
      this.errors.push(new DataError(`invalid hours ${drone.airTimeHours}`, drone))
    }
    return !hasErrors;
  }

  getCarByLicense(licenseNumber) {
    return this.cars.find(function (car) {
      return car.license === licenseNumber;
    })
  }
}