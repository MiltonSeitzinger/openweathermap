'use strict'

const bodyParser = require('body-parser')
const port = process.env.PORT || 3000
const express = require('express')
const app = express()
const cors = require('cors')


app.use(cors())
app.use(bodyParser.json({limit:'5mb'}))
app.use(bodyParser.urlencoded({extended:false, limit:'5mb'}))
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", '*')
	res.header("Access-Control-Allow-Credentials", true)
	res.header("Access-Control-Allow-Methods", 'GET, POST, PUT,  DELETE, PATCH')
	res.header("Access-Control-Allow-Headers", 'Origin, X-Requested-With, Content-Type, Accept')
	next()
})

require('./routes/routes.js')(app)

app.get('*', (req, res) => {
	res.status(404).send({mensaje: 'No existe la ruta'})
})
app.listen(port, () => {
	console.log('Server Running on port: ', port)
})

module.exports = app
