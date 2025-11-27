import * as publicIpv4 from 'public-ip';
import nodeFetch from 'node-fetch';
import { KEYWEATHERMAP, IP_API } from '../config/config';

export async function getLocation() {
	return new Promise(async (resolve, reject) => {
		let ip = await publicIpv4.publicIpv4()
		let cities = await nodeFetch(IP_API + ip)
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
		let currentWeather = await nodeFetch(url)
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


export async function forecastLocation(city: string) {
	let url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${KEYWEATHERMAP}&units=metric&lang=es`
	return new Promise(async (resolve, reject) => {
		let currentWeather = await nodeFetch(url)
			.then(openWheater => openWheater.json())
			.then((weather: any	) => {
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