'use strict'

const publicIp = require('public-ip');
const fetch = require('node-fetch')

const { KEYWEATHERMAP, IP_API } = require('./config')

/** 
** Function -> /getLocation
*  @params  -> no contiene.
*  Obtiene la direccion publica con publicIp.v4()
*	 Una vez obtenida la IP, consulta los datos de la ciudad con IP_API 
*  @return -> Los datos de la ciudad de acuerdo a la IP, sino os obtiene devuelve un mensaje de error.
**/
async function getLocation() {
    return new Promise(async(resolve, reject) => {
        let ip = await publicIp.v4()
        let cities = await fetch(IP_API+ip)
            .then(response => response.json())
            .then((city) => {
                if (city.status == 'fail') {
                    return false
                } else {
                    return city
                }
            })
        if(!cities) {
            reject('No se pudo obtener la ciudad')
            return false
        } else {
            resolve(cities)
        }
    })
}

/** 
** Function -> /currentLocation
*  @params  -> city.
*  De acuerdo al valor de city que recibe como parametro busca los datos del tiempo actual en openweathermap.
*  Puede haber 3 tipos de return
*  @return -> status 200 -> la consulta se realizo de manera exitosa y devuelve los datos obtenidos.
*  @return -> status 404 -> Realizo la consulta de manera exitosa, pero no pudo encontrar datos del tiempo con el valor de city.
*  @return -> la consulta no se realizo de manera exitosa y devuelve el error del problema.
**/
async function currentLocation(city){
	let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${KEYWEATHERMAP}&units=metric&lang=es`
	return new Promise(async(resolve, reject) => {
		let currentWeather = await fetch(url)
					.then(openWheater => openWheater.json())
					.then((weather) => {
						return weather
					})
		if(currentWeather.cod == 404){
			reject('404')
		} else if (currentWeather.cod == 200) {
			resolve(currentWeather)
		} else{
			reject(currentWeather.message)
		}
	})
}
module.exports = {
		getLocation,
		currentLocation
}