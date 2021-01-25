const request = require('supertest')

const app = require('../index')

/**
 * Testear la ruta de location
 */

describe("GET /v1/location", () => {
    it('Devuelve los datos de ubicación de acuerdo a la IP', done => {
    	request(app)
            .get('/v1/location')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done)

    });
});


/**
 * Testear las rutas de current
 */
describe("GET /v1/current/?city", () => {
	/**
 	* Testear la ruta de current, obteniendo el estado del tiempo actual con la IP del usuario
 	*/
	it('Obtención del tiempo actual sin parámetros, tomando la localización de acuerdo a la IP', done => {
		request(app)
		.get('/v1/current')
		.set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(done)
	});

	/**
 	* Testear la ruta de current, obteniendo el estado del tiempo actual con la ciudad como parámetro
 	*/
	it('Obtención del tiempo actual con parámetros', done => {
		request(app)
		.get('/v1/current/asuncion')
		.set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(done)
	});

	/**
 	* Testear la ruta de current, obteniendo el estado del tiempo actual con city que no existe
 	*/
	it('Una ciudad inexistente pasada como parámetro', done => {
		request(app)
		.get('/v1/current/cualquierciudad')
		.set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404)
      	.expect('{"error":"No se pudo encontrar la ciudad"}')
      	.end((err) => {
        	if (err) return done(err);
        	done();
      	});
	})

	/**
 	* Testear la ruta de current, con una apikeyInvalida.
 	
	it('En caso de que no exista la apiKey de openMapWeather', done => {
		request(app)
			.get('/v1/current')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(500, done)

	});*/

})


describe("GET /v1/forecast/?city", () => {
	/**
 	* Testear la ruta de forecast, obteniendo el estado del tiempo 3-5 dias con la IP del cliente.
 	*/
	it('Obtención del tiempo 3-5 dias sin parámetros, tomando la localización de acuerdo a la IP', done => {
		//setTimeout(done, 150);
		request(app)
		.get('/v1/forecast')
		.set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(done)
	});
	
	/**
 	* Testear la ruta de forecast, obteniendo el estado del tiempo 3-5 dias con la la ciudad como parámetro.
 	*/
	it('Obtención del tiempo 3-5 dias con parámetro válido', done => {
		//setTimeout(done, 150);
		request(app)
		.get('/v1/forecast/resistencia')
		.set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(done)
	});

	/**
 	* Testear la ruta de forecast, con parámetro inexistente.
 	*/
	it('Una ciudad inexistente pasado como parámetro', done => {
		//setTimeout(done, 150);
		request(app)
		.get('/v1/forecast/cualquierciudad')
		.set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404)
      	.expect('{"error":"No se pudo encontrar la ciudad"}')
      	.end((err) => {
        	if (err) return done(err);
        	done();
      	});
	})

	/**
 	* Testear la ruta de forecast, sin apiKey.
 	
	it('En caso de que no exista la apiKey de openMapWeather', done => {
		request(app)
			.get('/v1/current')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(500, done)

	});*/
})

/**
 * Testear una ruta inexistente
 */

describe("GET /v1/rutainexistente", () => {
    it('Una ruta que no es válida', done => {
        request(app)
            .get('/v1/rutainexistente')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404)
      		.expect('{"mensaje":"No existe la ruta"}')
      		.end((err) => {
        		if (err) return done(err);
        		done();
      	});
    });
});

