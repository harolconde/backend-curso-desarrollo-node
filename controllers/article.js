'use strict'

let validator = require('validator') // Validador de inputs, email... etc
let Article = require('../models/article') // modelo articulo importado
let fs = require('fs') // FileSistem
let path = require('path') // path
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
        try {
            var validate_title = !validator.isEmpty(params.title)
            var validate_content = !validator.isEmpty(params.content)
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            })
        }

        // Find an update
        if (validate_title && validate_content) {
            Article.findOneAndUpdate({ _id: articleId }, params, { new: true }, (err, articleUpdated) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar'
                    })
                }
                if (!articleUpdated) {
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
        Article.findByIdAndDelete({ _id: articleId }, (err, articleRemoved) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al borrar el articulo'
                })
            }
            if (!articleRemoved) {
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
    },

    // Subida de archivos al server
    uploadImage: (req, res) => {

        // Recoger fichero de la peticion
        var file_name = 'Imagen no subida'

        //console.log(req.files)
        if (!req.files) {
            return res.status(404).send({
                status: 'error',
                message: file_name
            })
        }
        // Variable que captura el path
        var file_path = req.files.file0.path;
        // // Variable que saca la ubicacion y el nombre del archivo de imagen
        var file_split = file_path.split('\\') // Linus y Mac .split('/')
        // // Variable que obtiene el nombre del archivo
        var file_name = file_split[2]
        // // Variable que obiene el nombre de la extencion del archivo.
        var extencion_split = file_name.split('\.')
        var ext_file = extencion_split[1]

        // return res.status(404).send({
        //     fichero : req.files,
        //     extencion : file_path,
        //     file: file_split
        // })

        // Comprobacion de las extenciones; solo imagenes
        if (ext_file != 'png' && ext_file != 'jpg' && ext_file != 'jpeg' && ext_file != 'svg' && ext_file != 'gif') {
            // Borrar el archivo pero primero importar fileSistem (fs) y path (path)
            fs.unlink(file_path, (error) => {
                return res.status(200).send({
                    status: 'error',
                    message: 'Extencion de archivo invalida'
                })
            })
        } else {
            // Si todo es valido obtener id de la url (id del articulo)
            let articleId = req.params.id

            // Buscar articulo, asignarle el nombre de la imagen y actualizarlo
            Article.findOneAndUpdate({ _id: articleId }, { image: file_name }, { new: true }, (err, articleUpdated) => {
                if (err || !articleUpdated) {
                    return res.status(200).send({
                        status: 'Error',
                        message: 'Error al guardar la imagen'
                    })
                }

                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
                })
            })

        }

    },

    // Obtener imagenes de los articulos
    getImage: (req, res) => {
        let file = req.params.image // Captura el fichero
        let path_file = `./upload/articles/${file}` // Captura ruta del ficher o a devolver

        // Comprobar si extiste el archivo y retornarlo
        fs.exists(path_file, (exists) => {
            if (exists) {
                return res.sendFile(path.resolve(path_file)) // Retorno de la imagen
            }
            else {
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe'
                })
            }
        })
    },

    // Filtro de busqueda de articulos
    searchArticles: (req, res) => {
        // Sacar string a buscar
        let searchStrings = req.params.search
        // Findo "or" condicional que usa node.js es importante aquí!!
        Article.find({
            "$or": [
                { "title": { "$regex": searchStrings, "$options": "i" } }, // Buscar por titulo del articulo
                { "content": { "$regex": searchStrings, "$options": "i" } } // Buscar por contenido del articulo
            ]
        })
            .sort([['date', 'descending']]) // Devolver resultado por fecha mas reciente
            .exec((err, articles) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error en la peticion'
                    })
                }
                if (!articles || articles.length <= 0) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No hay articulos que coincidan con el criterio de busqueda'
                    })
                }
                return res.status(200).send({
                    status: 'success',
                    articles
                })
            })

    }

}

module.exports = controller