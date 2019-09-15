'use strict'

// Requerir express
const express = require('express')
// Requerir el archivo.js del controllador
let articleController = require('../controllers/article')
// crear variable para adicionarle las fuciones de routing de express
let router = express.Router()

// Crear las rutas
router.get('/test-de-controlador', articleController.test)
router.post('/datos-del-curso', articleController.datosCurso)
router.post('/guardar-articulo', articleController.saveArticle)

// Exportar el modulo
module.exports = router