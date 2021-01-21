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

module.exports = {
    getLocation
}