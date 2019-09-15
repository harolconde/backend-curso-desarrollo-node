'use strict'

const express = require('express')
const bodyParser = require('body-parser')

// Pasar express a variable app para utilizar http
let app = express()

// Requerir el archivo.js del routing
let article_routes = require('./routes/article')

// Convertir peticiones a json
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Agregar una nueva ruta 
app.use('/api/',article_routes)

// Exportar el modulo para usar en mi index.js
module.exports = app

