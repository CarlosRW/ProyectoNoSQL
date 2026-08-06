const mongoose = require('mongoose');

const HistoricoKpiSchema = new mongoose.Schema(
    {
        indicador: {
            type: String,
            required: [true, 'El indicador es obligatorio'],
            trim: true
        },

        valor: {
            type: Number,
            required: [true, 'El valor es obligatorio']
        },

        periodo: {
            type: String,
            required: [true, 'El periodo es obligatorio'],
            trim: true
        },

        fecha: {
            type: Date,
            required: [true, 'La fecha es obligatoria'],
            default: Date.now
        },

        observaciones: {
            type: String,
            trim: true,
            default: ''
        }
    },
    {
        collection: 'historico_kpis',
        timestamps: true
    }
);

module.exports = mongoose.model('HistoricoKpi', HistoricoKpiSchema);
