'use strict'

const express = require('express')
const bodyParser = require('body-parser')

// Pasar express a variable app para utilizar http
let app = express()

// Convertir peticiones a json
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Agregar una nueva ruta
app.get('/probando', (req, res) => {
    console.log('Nueva ruta creada')
    res.status(200).send(
       {
           nombre: 'Curso master frameworks javascript',
           alumno: 'Harol Conde'
       }
    )
})

// Exportar el modulo para usar en mi index.js
module.exports = app

