const mongoose = require('mongoose');

const CostoVariableSchema = new mongoose.Schema(
    {
        tipo_costo: {
            type: String,
            required: [true, 'El tipo de costo es obligatorio'],
            enum: {
                values: [
                    'combustible',
                    'mantenimiento',
                    'insumos',
                    'personal_temporal',
                    'comisiones_terceros',
                    'otros'
                ],
                message: 'El tipo de costo seleccionado no es válido'
            }
        },

        salida_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SalidaOperacion',
            required: [true, 'La salida u operación es obligatoria']
        },

        monto: {
            type: Number,
            required: [true, 'El monto es obligatorio'],
            min: [0, 'El monto no puede ser negativo']
        },

        moneda: {
            type: String,
            required: [true, 'La moneda es obligatoria'],
            enum: {
                values: ['USD', 'CRC'],
                message: 'La moneda seleccionada no es válida'
            },
            default: 'CRC'
        },

        fecha: {
            type: Date,
            required: [true, 'La fecha es obligatoria'],
            default: Date.now
        },

        responsable_registro: {
            type: String,
            required: [true, 'El responsable del registro es obligatorio'],
            trim: true
        }
    },
    {
        collection: 'costos_variables',
        timestamps: true
    }
);

module.exports = mongoose.model('CostoVariable', CostoVariableSchema);
