'use strict'

// Requerir mongoose
const mongoose = require('mongoose')
// Importar modulo app.js
let app = require('./app')
// definir el puerto
let port = 3000

// Resetear y eliminar funciones viejas del mongoose y trabajar con las ultimas
mongoose.set('useFindAndModify', false)
// Declarar Promises para evitar fallos al trabajaro con mongoDB
mongoose.Promise = global.Promise
// Conexion a mongoDB
mongoose.connect('mongodb://localhost:27017/api_rest_blog', { useNewUrlParser: true })
    .then(() => {
        console.log('El servido se ha conectado a las bases de datos correctamente!!')

        // Crear servidor
        app.listen(port, () => {
            console.log(`Servidor corriendo en http://localhost:${port}`)
        })
    })