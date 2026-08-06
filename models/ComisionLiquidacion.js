const mongoose = require('mongoose');

const ComisionLiquidacionSchema = new mongoose.Schema(
    {
        vendedor_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vendedor',
            required: [true, 'El vendedor es obligatorio']
        },

        periodo: {
            type: String,
            required: [true, 'El periodo es obligatorio'],
            trim: true
        },

        monto_comision: {
            type: Number,
            required: [true, 'El monto de la comisión es obligatorio'],
            min: [0, 'El monto de la comisión no puede ser negativo']
        },

        estado_liquidacion: {
            type: String,
            required: [true, 'El estado de la liquidación es obligatorio'],
            enum: {
                values: ['pendiente', 'liquidada', 'anulada'],
                message: 'El estado de liquidación seleccionado no es válido'
            },
            default: 'pendiente'
        },

        fecha_liquidacion: {
            type: Date,
            default: null
        },

        observaciones: {
            type: String,
            trim: true,
            default: ''
        }
    },
    {
        collection: 'comisiones_liquidacion',
        timestamps: true
    }
);

module.exports = mongoose.model('ComisionLiquidacion', ComisionLiquidacionSchema);