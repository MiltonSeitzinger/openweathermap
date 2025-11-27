import * as publicIp from 'public-ip';
import fetch from 'node-fetch';
import { KEYWEATHERMAP, IP_API } from '../config/config';

export async function getLocation(): Promise<any> {
	return new Promise(async (resolve, reject) => {
		let ip = await publicIp.publicIpv4()
		let cities = await fetch(IP_API + ip)
			.then(response => response.json())
			.then((city: any) => {
				if (city.status == 'fail') {
					return false
				} else {
					return city
				}
			})
		if (!cities) {
			reject('No se pudo obtener la ciudad')
		} else {
			resolve(cities)
		}
	})
}


export async function currentLocation(city: string) {
	let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${KEYWEATHERMAP}&units=metric&lang=es`
	return new Promise(async (resolve, reject) => {
		let currentWeather = await fetch(url)
			.then(openWheater => openWheater.json())
			.then((weather: any) => {
				return weather
			})
		if (currentWeather.cod == 404) {
			reject('404')
		} else if (currentWeather.cod == 200) {
			resolve(currentWeather)
		} else {
			reject(currentWeather.message)
		}
	})
}

export async function forecastLocation(city: string): Promise<any> {
	let url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${KEYWEATHERMAP}&units=metric&lang=es`
	return new Promise(async (resolve, reject) => {
		let currentWeather = await fetch(url)
			.then(openWheater => openWheater.json())
			.then((weather: any) => {
				return weather
			})
		if (currentWeather.cod == 404) {
			reject('404')
		} else if (currentWeather.cod == 200) {
			resolve(currentWeather)
		} else {
			reject(currentWeather.message)
		}
	})
}
