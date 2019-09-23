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

// CORS
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Permitir que cualquer cliente haga las peticiones ajax
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// Agregar una nueva ruta 
app.use('/api/', article_routes)

// Exportar el modulo para usar en mi index.js
module.exports = app

