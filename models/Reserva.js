const mongoose = require('mongoose');

const ReservaSchema = new mongoose.Schema(
    {
        cliente_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Cliente',
            required: [true, 'El cliente es obligatorio']
        },

        tour_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tour',
            required: [true, 'El tour es obligatorio']
        },

        canal_venta: {
            type: String,
            required: [true, 'El canal de venta es obligatorio'],
            enum: {
                values: [
                    'web',
                    'presencial',
                    'vendedor_externo',
                    'hotel_asociado'
                ],
                message: 'El canal de venta seleccionado no es válido'
            }
        },

        vendedor_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vendedor',
            default: null
        },

        cantidad_personas: {
            type: Number,
            required: [true, 'La cantidad de personas es obligatoria'],
            min: [1, 'La cantidad de personas debe ser mayor que cero']
        },

        monto_total: {
            type: Number,
            required: [true, 'El monto total es obligatorio'],
            min: [0, 'El monto total no puede ser negativo']
        },

        moneda: {
            type: String,
            required: [true, 'La moneda es obligatoria'],
            enum: {
                values: ['USD', 'CRC'],
                message: 'La moneda seleccionada no es válida'
            },
            default: 'USD'
        },

        estado_pago: {
            type: String,
            required: [true, 'El estado de pago es obligatorio'],
            enum: {
                values: [
                    'pendiente',
                    'parcial',
                    'pagado',
                    'cancelado'
                ],
                message: 'El estado de pago seleccionado no es válido'
            },
            default: 'pendiente'
        },

        fecha_reserva: {
            type: Date,
            required: [true, 'La fecha de reserva es obligatoria'],
            default: Date.now
        },

        fecha_tour: {
            type: Date,
            required: [true, 'La fecha del tour es obligatoria']
        }
    },
    {
        collection: 'reservas',
        timestamps: true
    }
);

module.exports = mongoose.model('Reserva', ReservaSchema);