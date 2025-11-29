import * as publicIp from 'public-ip';
import fetch from 'node-fetch';
import { KEYWEATHERMAP, IP_API } from '../config/config';
import { IpApiSuccessResponse, IpApiResponse } from '../interface/location.interface';
import { WeatherResponse, WeatherApiResponse, ForecastResponse, ForecastApiResponse } from '../interface/weather.interface';

export async function getLocation(): Promise<IpApiSuccessResponse> {
	return new Promise(async (resolve, reject) => {
		let ip = await publicIp.publicIpv4()
		let cities = await fetch(IP_API + ip)
			.then(response => response.json())
			.then((city: unknown) => {
				const typedCity = city as IpApiResponse;
				if (typedCity.status == 'fail') {
					return false
				} else {
					return typedCity
				}
			})
		if (!cities) {
			reject('No se pudo obtener la ciudad')
		} else {
			resolve(cities)
		}
	})
}


export async function currentLocation(city: string): Promise<WeatherResponse> {
	let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${KEYWEATHERMAP}&units=metric&lang=es`
	return new Promise(async (resolve, reject) => {
		let currentWeather = await fetch(url)
			.then(openWheater => openWheater.json())
			.then((weather: unknown) => {
				const typedWeather = weather as WeatherApiResponse;
				console.log('currentLocation', typedWeather)
				return typedWeather
			})
		if (currentWeather.cod == 404) {
			reject('404')
		} else if (currentWeather.cod == 200) {
			resolve(currentWeather as WeatherResponse)
		} else {
			const errorResponse = currentWeather as WeatherApiResponse;
			reject('message' in errorResponse ? errorResponse.message : 'Error desconocido')
		}
	})
}

export async function forecastLocation(city: string): Promise<ForecastResponse> {
	let url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${KEYWEATHERMAP}&units=metric&lang=es`
	return new Promise(async (resolve, reject) => {
		let currentWeather = await fetch(url)
			.then(openWheater => openWheater.json())
			.then((weather: unknown) => {
				const typedWeather = weather as ForecastApiResponse;
				console.log('forecastLocation', typedWeather)
				return typedWeather
			})
		if (currentWeather.cod == 404) {
			reject('404')
		} else if (currentWeather.cod == 200 || currentWeather.cod == '200') {
			resolve(currentWeather as ForecastResponse)
		} else {
			const errorResponse = currentWeather as ForecastApiResponse;
			reject('message' in errorResponse ? errorResponse.message : 'Error desconocido')
		}
	})
}
