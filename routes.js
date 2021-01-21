'use strict'

const controllers = require('./controller')

module.exports = function (app){

    /** 
    ** Endpoint -> /location
    *  @params  -> no contiene.
    *  @return -> Los datos de la ciudad de acuerdo a la IP.
    **/
    app.get('/v1/location', (req, res) => {
			controllers.getLocation()
				.then((locations) => {
					console.log('location: ', locations)
					res.status(200).send({ locations: locations})
			})
				.catch((err) => {
					res.status(404).send({ error: err})
				})

    })

    /** 
    ** Endpoint -> /current/:city
    *  @params -> city, el cual es opcional.
    *  Si city viene incluido devuelve los datos de la ciudad y datos del tiempo actuales.
    *  Si city no viene incluido devuelve los datos de la ciudad y datos del tiempo actuales de acuerdo a la IP.
    *  @return -> Los datos de la ciudad y del tiempo actual.
    **/
    app.get('/v1/current/:city?', async (req, res, next) => {
        res.status(200).send({ mensaje: 'Los datos de la ciudad y del tiempo actual'})
    })

    /** 
    ** Endpoint -> /forecast/:city
    *  @params -> city, el cual es opcional.
    *  Si city viene incluido devuelve los datos de la ciudad y datos del tiempo de 5 dias, cada 3 horas.
    *  Si city no viene incluido devuelve los datos de la ciudad y datos del tiempo de 5 dias, cada 3 horas de acuerdo a la IP.
    *  @return -> Los datos de la ciudad y del tiempo de 5 dias, con informacion de cada 3 horas.
    **/
    app.get('/v1/forecast/:city?', async (req, res, next) => {
        res.status(200).send({ mensaje: 'Los datos de la ciudad y del tiempo de 5 dias, con informacion de cada 3 horas.'})
		})

}