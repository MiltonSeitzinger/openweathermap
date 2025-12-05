import { Express } from 'express';
import * as locationControllers from '../controller/location.controller';


export default function (app: Express): void {

	app.get('/v1/location', locationControllers.getLocation);
}