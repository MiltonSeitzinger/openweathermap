import { Express, Request, Response, NextFunction } from 'express';
import * as controllers from '../controller/controller';

export default function (app: Express): void {

	app.get('/v1/location', async (_req: Request, res: Response) => {
		controllers.getLocation()
			.then((locations: any) => {
				return res.status(200).send({ locations: locations });
			})
			.catch((err: any) => {
				return res.status(404).send({ error: err });
			});
	});

	/** 
	 * Endpoint -> /current (sin parámetro)
	 * Obtiene el nombre de la ciudad actual a traves de la IP y luego el tiempo actual.
	 * @return -> Los datos de la ciudad y del tiempo actual.
	 */
	app.get('/v1/current', async (_req: Request, res: Response, _next: NextFunction) => {
		let ciudad: string;

		ciudad = await controllers.getLocation()
			.then((locations: any) => {
				return locations.city || '';
			})
			.catch((err: any) => {
				return err;
			});

		controllers.currentLocation(ciudad)
			.then((locations: any) => {
				return res.status(200).send({ locations: locations });
			})
			.catch((err: any) => {
				if (err == '404') {
					return res.status(404).send({ error: "No se pudo encontrar la ciudad" });
				} else {
					return res.status(500).send({ error: err });
				}
			});
	});

	/** 
	 * Endpoint -> /current/:city
	 * @params -> city, el cual es requerido.
	 * Utiliza el parámetro city para llamar a currentLocation().
	 * @return -> Los datos de la ciudad y del tiempo actual.
	 */
	app.get('/v1/current/:city', async (req: Request, res: Response, _next: NextFunction) => {
		const ciudad: string = req.params.city;

		controllers.currentLocation(ciudad)
			.then((locations: any) => {
				return res.status(200).send({ locations: locations });
			})
			.catch((err: any) => {
				if (err == '404') {
					return res.status(404).send({ error: "No se pudo encontrar la ciudad" });
				} else {
					return res.status(500).send({ error: err });
				}
			});
	});

	/** 
	 * Endpoint -> /forecast (sin parámetro)
	 * Obtiene el nombre de la ciudad actual a traves de la IP y luego el pronóstico extendido.
	 * @return -> Los datos de la ciudad y del tiempo extendido a 5 dias.
	 */
	app.get('/v1/forecast', async (_req: Request, res: Response, _next: NextFunction) => {
		let ciudad: string;

		ciudad = await controllers.getLocation()
			.then((locations: any) => {
				return locations.city || '';
			})
			.catch((err: any) => {
				return err;
			});

		controllers.forecastLocation(ciudad)
			.then((locations: any) => {
				return res.status(200).send({ locations: locations });
			})
			.catch((err: any) => {
				if (err == '404') {
					return res.status(404).send({ error: "No se pudo encontrar la ciudad" });
				} else {
					return res.status(500).send({ error: err });
				}
			});
	});

	/** 
	 * Endpoint -> /forecast/:city
	 * @params -> city, el cual es requerido.
	 * Utiliza el parámetro city para llamar a forecastLocation().
	 * @return -> Los datos de la ciudad y del tiempo extendido a 5 dias.
	 */
	app.get('/v1/forecast/:city', async (req: Request, res: Response, _next: NextFunction) => {
		const ciudad: string = req.params.city;

		controllers.forecastLocation(ciudad)
			.then((locations: any) => {
				return res.status(200).send({ locations: locations });
			})
			.catch((err: any) => {
				if (err == '404') {
					return res.status(404).send({ error: "No se pudo encontrar la ciudad" });
				} else {
					return res.status(500).send({ error: err });
				}
			});
	});
}