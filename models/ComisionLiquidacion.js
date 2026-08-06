const mongoose = require('mongoose');

const ComisionLiquidacionSchema = new mongoose.Schema(
    {
        vendedor_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vendedor',
            required: [true, 'El vendedor es obligatorio']
        },

        reserva_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Reserva',
            required: [true, 'La reserva es obligatoria']
        },

        monto_comision: {
            type: Number,
            required: [true, 'El monto de la comisión es obligatorio'],
            min: [0, 'El monto de la comisión no puede ser negativo']
        },

        estado: {
            type: String,
            required: [true, 'El estado es obligatorio'],
            enum: {
                values: ['pendiente', 'liquidada', 'anulada'],
                message: 'El estado seleccionado no es válido'
            },
            default: 'pendiente'
        },

        fecha_generada: {
            type: Date,
            required: [true, 'La fecha de generación es obligatoria'],
            default: Date.now
        },

        fecha_liquidada: {
            type: Date,
            default: null
        }
    },
    {
        collection: 'comisiones_liquidacion',
        timestamps: true
    }
);

module.exports = mongoose.model('ComisionLiquidacion', ComisionLiquidacionSchema);
