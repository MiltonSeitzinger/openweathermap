
import { Request, Response } from 'express';
import { getCity, getIp } from '../service/location.service';
import { fetchWeather } from '../service/weather.service';
import { IpApiSuccessResponse } from '../interface/location.interface';


export async function currentLocationWeatherByIp(_req: Request, res: Response) {
	try {
		const ip = await getIp();
		const cityData = await getCity(ip);
		const weather = await fetchWeather((cityData as IpApiSuccessResponse).city, 'current');
		return res.status(200).json(weather);
	} catch (err) {
		res.status(500).json({ error: err });
		throw err;
	}
}

export async function currentLocationWeatherByCity(req: Request, res: Response) {
	try {
		const city = req.params.city;
		
		if (!city) {
			return res.status(400).json({ error: 'City is required' });
		}

		const weather = await fetchWeather(city, 'current');
		return res.status(200).json(weather);
	} catch (err) {
		res.status(500).json({ error: err });
		throw err;
	}
}

export async function forecastLocationWeatherByIp(_req: Request, res: Response) {
	try {
		const ip = await getIp();
		const cityData = await getCity(ip);
		const weather = await fetchWeather((cityData as IpApiSuccessResponse).city, 'forecast');
		return res.status(200).json(weather);
	} catch (err) {
		res.status(500).json({ error: err });
		throw err;
	}
}

export async function forecastLocationWeatherByCity(req: Request, res: Response) {
	try {
		const city = req.params.city;
		if (!city) {
			return res.status(400).json({ error: 'City is required' });
		}
		const weather = await fetchWeather(city, 'forecast');
		return res.status(200).json(weather);
	} catch (err) {
		res.status(500).json({ error: err });
		throw err;
	}
}