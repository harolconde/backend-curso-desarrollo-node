'use strict'

// Requerir express
const express = require('express')
// Requerir el archivo.js del controllador
let articleController = require('../controllers/article')
// Requerir connect-multiparty
let multiparty = require('connect-multiparty')

// crear variable para adicionarle las fuciones de routing de express
let router = express.Router()

// crear variable para usar los metodos del connect-multiparty
let md_upload = multiparty({ uploadDir: './upload/articles' })

// Crear las rutas
router.get('/test-de-controlador', articleController.test)
router.post('/datos-del-curso', articleController.datosCurso)

// Rutas utiles de la app
// Guardar un nuevo articulo
router.post('/guardar-articulo', articleController.saveArticle)
// Traer todos los articulos y los ultimos articulos como opcional
router.get('/articulos/:last?', articleController.getArticles)
// Traer un articulo especifico
router.get('/articulo/:id', articleController.getArticle)
// Actualizar un articulo especifico
router.put('/articulo-update/:id', articleController.updateArticle)
// Eliminar un articulo especifico
router.delete('/articulo/:id', articleController.deleteArticle)
// Ruta subir archivo de imagen
router.post('/upload-img/:id', md_upload, articleController.uploadImage)
// Traer las imagenes de los articulos
router.get('/get-image/:image', articleController.getImage)
// Filtro de busqueda
router.get('/buscar-articulo/:search', articleController.searchArticles)

// Exportar el modulo
module.exports = router