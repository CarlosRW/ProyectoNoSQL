const mongoose = require('mongoose');

const HistoricoKpiSchema = new mongoose.Schema(
    {
        mes: {
            type: String,
            required: [true, 'El mes es obligatorio'],
            trim: true,
            match: [/^\d{4}-\d{2}$/, 'El mes debe tener el formato AAAA-MM']
        },

        temporada: {
            type: String,
            required: [true, 'La temporada es obligatoria'],
            enum: {
                values: ['alta', 'baja'],
                message: 'La temporada seleccionada no es válida'
            }
        },

        total_clientes: {
            type: Number,
            required: [true, 'El total de clientes es obligatorio'],
            min: [0, 'El total de clientes no puede ser negativo']
        },

        ocupacion_promedio: {
            type: Number,
            required: [true, 'La ocupación promedio es obligatoria'],
            min: [0, 'La ocupación promedio no puede ser negativa'],
            max: [1, 'La ocupación promedio no puede superar el 100%']
        },

        tour_mas_vendido: {
            type: String,
            required: [true, 'El tour más vendido es obligatorio'],
            trim: true
        },

        ingresos_totales: {
            type: Number,
            required: [true, 'Los ingresos totales son obligatorios'],
            min: [0, 'Los ingresos totales no pueden ser negativos']
        },

        costos_totales: {
            type: Number,
            required: [true, 'Los costos totales son obligatorios'],
            min: [0, 'Los costos totales no pueden ser negativos']
        },

        rentabilidad_neta: {
            type: Number,
            required: [true, 'La rentabilidad neta es obligatoria']
        }
    },
    {
        collection: 'historico_kpis',
        timestamps: true
    }
);

module.exports = mongoose.model('HistoricoKpi', HistoricoKpiSchema);
