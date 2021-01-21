
module.exports = function (app){

    /** 
    ** Endpoint -> /location
    *  Params -> no contiene.
    ** Return -> Los datos de la ciudad de acuerdo a la IP.
    **/
    app.get('/v1/location', async (req, res, next) => {
        res.status(200).send({ mensaje: 'obtendria la localizacion con la IP'})
    })

    /** 
    ** Endpoint -> /current/:city
    *  Params -> city, el cual es opcional.
    *  Si city viene incluido devuelve los datos de la ciudad y datos del tiempo actuales.
    *  Si city no viene incluido devuelve los datos de la ciudad y datos del tiempo actuales de acuerdo a la IP.
    ** Return -> Los datos de la ciudad y del tiempo actual.
    **/
    app.get('/v1/current/:city?', async (req, res, next) => {
        res.status(200).send({ mensaje: 'Los datos de la ciudad y del tiempo actual'})
    })

    /** 
    ** Endpoint -> /forecast/:city
    *  Params -> city, el cual es opcional.
    *  Si city viene incluido devuelve los datos de la ciudad y datos del tiempo de 5 dias, cada 3 horas.
    *  Si city no viene incluido devuelve los datos de la ciudad y datos del tiempo de 5 dias, cada 3 horas de acuerdo a la IP.
    ** Return -> Los datos de la ciudad y del tiempo de 5 dias, con informacion de cada 3 horas.
    **/
    app.get('/v1/forecast/:city?', async (req, res, next) => {
        res.status(200).send({ mensaje: 'Los datos de la ciudad y del tiempo de 5 dias, con informacion de cada 3 horas.'})
		})

}