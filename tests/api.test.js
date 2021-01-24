const request = require('supertest')

const app = require('../index')

/**
 * Testear la ruta de location
 */

describe("Obtencion de la localizacion", () => {
    it('Devuelve los datos de ubicacion de acuerdo a la ip', done => {
        request(app)
            .get('/v1/location')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done)
    })
});
