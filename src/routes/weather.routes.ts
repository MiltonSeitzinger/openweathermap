import { Express } from 'express';
import * as weatherControllers from '../controller/weather.controller';
import * as locationControllers from '../controller/location.controller';


export default function (app: Express): void {

	app.get('/v1/location', locationControllers.getLocation);

	app.get('/v1/current', weatherControllers.currentLocationWeatherByIp);

	app.get('/v1/current/:city', weatherControllers.currentLocationWeatherByCity);

	app.get('/v1/forecast', weatherControllers.forecastLocationWeatherByIp);

	app.get('/v1/forecast/:city', weatherControllers.forecastLocationWeatherByCity);
}