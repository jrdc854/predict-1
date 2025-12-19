'use stric';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PredictionSchema = new Schema({
    features: {
        type: [Number],
        required: true
    },
    prediction: {
        type: Number,
        required: true
    },
    ts: {
        type: Date,
        default: Date.now
    },
    modelVersion: {
        type: String
    }
})

module.exports = mongoose.model('Prediction', PredictionSchema);