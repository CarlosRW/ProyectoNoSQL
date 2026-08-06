const mongoose = require('mongoose');

const SalidaOperacionSchema = new mongoose.Schema(
    {
        tour_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tour',
            required: [true, 'El tour es obligatorio']
        },

        embarcacion_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Embarcacion',
            required: [true, 'La embarcación es obligatoria']
        },

        capitan_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Personal',
            required: [true, 'El capitán es obligatorio']
        },

        guia_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Personal',
            required: [true, 'El guía es obligatorio']
        },

        fecha_salida: {
            type: Date,
            required: [
                true,
                'La fecha y hora de salida son obligatorias'
            ]
        },

        pasajeros_confirmados: {
            type: Number,
            required: [
                true,
                'La cantidad de pasajeros es obligatoria'
            ],
            min: [
                1,
                'Debe existir al menos un pasajero confirmado'
            ]
        },

        capacidad_embarcacion: {
            type: Number,
            required: true,
            min: [
                1,
                'La capacidad de la embarcación debe ser mayor que cero'
            ]
        },

        tasa_ocupacion: {
            type: Number,
            required: true,
            min: [
                0,
                'La tasa de ocupación no puede ser negativa'
            ],
            max: [
                1,
                'La tasa de ocupación no puede superar el 100%'
            ]
        }
    },
    {
        collection: 'salidas_operaciones',
        timestamps: true
    }
);

module.exports = mongoose.model(
    'SalidaOperacion',
    SalidaOperacionSchema
);