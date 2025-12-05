import { Express } from 'express';
import * as controllers from '../controller/weather.controller';

export default function (app: Express): void {

	app.get('/v1/location', controllers.getLocation);

	app.get('/v1/current', controllers.currentLocationWeatherByIp);

	app.get('/v1/current/:city', controllers.currentLocationWeatherByCity);

	app.get('/v1/forecast', controllers.forecastLocationWeatherByIp);

	app.get('/v1/forecast/:city', controllers.forecastLocationWeatherByCity);
}