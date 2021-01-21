'use strict'

const controllers = require('./controller')

module.exports = function (app){

    /** 
    ** Endpoint -> /location
    *  Llama al controlador getLocation -> La cual obtiene los datos de la ciudad de acuerdo a la IP.
    **/
    app.get('/v1/location', (req, res) => {
			controllers.getLocation()
				.then((locations) => {
					return res.status(200).send({ locations: locations})
			})
				.catch((err) => {
					return res.status(404).send({ error: err})
				})

    })

    /** 
    ** Endpoint -> /current/:city
    *  @params -> city, el cual es opcional.
    *  Si city viene incluido como parametro lo utiliza al momento de llamar a currentLocation().
    *  Si city no viene incluido llama a getLocation(), para obtener el nombre de la ciudad actual a traves de la IP.
    *  @return -> Los datos de la ciudad y del tiempo actual.
    **/
    app.get('/v1/current/:city?', async (req, res, next) => {
			let ciudad
			if (req.params.city) {
				ciudad = req.params.city
			} else {
				ciudad = await controllers.getLocation().then((locations) => { return locations.city }).catch((err) => {return err})
			}
			controllers.currentLocation(ciudad)
				.then((locations) => {
					return res.status(200).send({ locations: locations})
			})
				.catch((err) => {
					if(err == '404'){
						return res.status(404).send({ error: "No se pudo encontrar la ciudad"})
					}else{
						return res.status(500).send({ error: err})
					}
				})
    })

    /** 
    ** Endpoint -> /forecast/:city
    *  @params -> city, el cual es opcional.
    *  Si city viene incluido como parametro lo utiliza al momento de llamar a currentLocation().
    *  Si city no viene incluido llama a getLocation(), para obtener el nombre de la ciudad actual a traves de la IP.
    *  @return -> Los datos de la ciudad y del tiempo extendido a 5 dias.
    **/
    app.get('/v1/forecast/:city?', async (req, res, next) => {
			let ciudad
			if (req.params.city) {
				ciudad = req.params.city
			} else {
				ciudad = await controllers.getLocation().then((locations) => { return locations.city }).catch((err) => {return err})
			}
			controllers.forecastLocation(ciudad)
				.then((locations) => {
					return res.status(200).send({ locations: locations})
			})
				.catch((err) => {
					if(err == '404'){
						return res.status(404).send({ error: "No se pudo encontrar la ciudad"})
					}else{
						return res.status(500).send({ error: err})
					}
				})
		})
}