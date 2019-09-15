'use strict'

// Requerir mongoose
let mongoose = require('mongoose')
let Schema = mongoose.Schema

let articleSchema = Schema({
    title: String,
    content: String,
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Article', articleSchema)
