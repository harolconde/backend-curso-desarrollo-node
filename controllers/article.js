'use strict'

let validator = require('validator')
let Article = require('../models/article')

//const article = new Article()
let controller = {
    datosCurso: (req, res) => {
        let hola = req.body.hola = 'Harol Conde'
        res.status(200).send({
            nombre: 'Curso master frameworks javascript',
            alumno: hola
        })
    },
    test: (req, res) => {
        res.status(200).send({
            message: 'Soy la accion de mi controlador de articulo'
        })
    },
    saveArticle: (req, res) => {
        // Recoger datos por post
        let params = req.body
        console.log(params)
        // Validar los datos
        try {
            let validate_title = !validator.isEmpty(params.title)
            let validate_content = !validator.isEmpty(params.content)

            if (validate_title && validate_content) {

                // Crear objeto del modelo a guardar
                const article = new Article()
                // Asignar valores
                article.title = params.title
                article.content = params.content
                article.image = null

                // Guardar los datos en la db
                article.save((err, articleStored) => {
                    // En caso de error
                    if (err || !articleStored) {
                        res.status(404).send({
                            status: 'Error',
                            message: 'El articulo no se ha guardado'
                        })
                    }

                    // Guardado con exito
                    res.status(200).send({
                        status: 'success',
                        article: articleStored
                    })
                })
            }
            else {
                res.status(200).send({
                    status: 'Error',
                    message: 'Los datos no son correctos'
                })
            }
        } catch (err) {
            res.status(200).send({
                message: 'Faltan datos por llenar!!!'
            })
        }

    },

    // Traer todos los articulos
    getArticles: (req, res) => {
        let query = Article.find({})
        let last = req.params.last
        if (last || last != undefined) {
            query.limit(5)
        }
        console.log(last)
        query.sort('-_id').exec((err, articles) => {
            if (err) {
                res.status(500).send({
                    status: 'Error',
                    message: 'Error al devolver los articulos'
                })
            }
            if (!articles) {
                res.status(404).send({
                    status: 'Error',
                    message: 'No hay articulos para mostrar'
                })
            }
            res.status(200).send({
                status: 'Success',
                articles
            })
        })
    },

    // Traer un articulo determinado por parametro
    getArticle: (req, res) => {
        let articleId = req.params.id
        if (!articleId || articleId == null) {
            return res.status(404).send({
                status: 'error',
                message: ' No existe el articulo !!!'
            })
        }

        // Buscar el articulo
        Article.findById(articleId, (err, article) => {

            if (err || !article) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el articulo'
                })
            }

            return res.status(200).send({
                status: 'success',
                article
            })
        })
    },

    // Metodo para actualizar un articulo determinado
    updateArticle: (req, res) => {
        // Recoger id de los articulos
        var articleId = req.params.id

        // Recoger los datos que llegan por put
        var params = req.body

        // Validar los datos
        try{
            var validate_title = !validator.isEmpty(params.title)
            var validate_content = !validator.isEmpty(params.content)
        }catch(err){
            return res.status(404).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            })
        }

        // Find an update
        if(validate_title && validate_content){
            Article.findOneAndUpdate({_id: articleId}, params, {new: true}, (err, articleUpdated) => {
                if(err){
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar'
                    })
                }
                if(!articleUpdated){
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el articulo'
                    })
                }
                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
                })
            })
        }
    },
    
    // Eliminar articulos
    deleteArticle: (req, res) => {
        // Recoger datos id de la url
        let articleId = req.params.id

        // Find an delete
        Article.findByIdAndDelete({_id: articleId}, (err, articleRemoved) => {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al borrar el articulo'
                })
            }
            if(!articleRemoved){
                return res.status(404).send({
                    status: 'error',
                    message: 'Error al borrar el articulo, es probable que el articulo no exista'
                })
            }
            return res.status(200).send({
                status: 'success',
                article: articleRemoved
            })
        })
    }
}

module.exports = controller