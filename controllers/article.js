'use strict'

let validator = require('validator')
let Article = require('../models/article')

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
                     if(err || !articleStored){
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

    }
}

module.exports = controller