"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
const { mongoose } = require('../configs/dbConnection')
/* ------------------------------------------------------- *
{
    "plateNumber": "34ABC123",
    "brand": "Ford",
    "model": "Focus",
    "year": 2020,
    "isAutomatic": true,
    "pricePerDay": 249.99
}
{
    "plateNumber": "34ABC234",
    "brand": "Renault",
    "model": "Megane",
    "year": 2022,
    "isAutomatic": false,
    "pricePerDay": 199.99
}
{
    "plateNumber": "34ABC345",
    "brand": "Opel",
    "model": "Astra",
    "year": 2021,
    "isAutomatic": false,
    "pricePerDay": 189.99,
    "isPublish": false
}
/* ------------------------------------------------------- */
// Car Model:

const CarSchema = new mongoose.Schema({

    plateNumber: {
        type: String,
        trim: true,
        required: true,
    }, 

    brand: {
        type: String,
        trim: true,
        required: true,
    }, 

    carmodel: {
        type: String,
        trim: true,
        required: true,
    }, 

    year: {
        type: Number,
        required: true,
    }, 

    isAutomatic: {
        type: Boolean,
        required: true,
    }, 

    isPublish: {
        type: Boolean,
        required: true,
    }, 

    pricePerDay: {
        type: Number,
        required: true,
    }, 

    createdId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    updatedId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

}, { collection: 'cars', timestamps: true })

/* ------------------------------------------------------- */
module.exports = mongoose.model('Car', CarSchema)