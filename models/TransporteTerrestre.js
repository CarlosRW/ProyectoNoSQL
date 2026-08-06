const mongoose = require('mongoose');

const TransporteTerrestreSchema = new mongoose.Schema(
    {
        vehiculo: {
            type: String,
            required: [true, 'El vehículo es obligatorio'],
            trim: true
        },
        capacidad_pasajeros: {
            type: Number,
            required: [true, 'La capacidad de pasajeros es obligatoria'],
            min: [1, 'La capacidad debe ser mayor que cero']
        },
        placa: {
            type: String,
            required: [true, 'La placa es obligatoria'],
            trim: true,
            uppercase: true
        },
        conductor_asignado: {
            type: String,
            required: [true, 'El conductor asignado es obligatorio'],
            trim: true
        },
        rutas_frecuentes: [
            {
                type: String,
                trim: true
            }
        ]
    },
    {
        collection: 'transporte_terrestre',
        timestamps: true
    }
);

module.exports = mongoose.model(
    'TransporteTerrestre',
    TransporteTerrestreSchema
);