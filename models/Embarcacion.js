const mongoose = require('mongoose');

const EmbarcacionSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true
    },
    capacidad_maxima: {
      type: Number,
      required: true
    },
    tipo: {
      type: String,
      required: true,
      enum: ['lancha turística', 'bote', 'catamarán']
    },
    estado: {
      type: String,
      required: true,
      enum: ['operativa', 'mantenimiento', 'fuera de servicio'],
      default: 'operativa'
    },
    ultimo_mantenimiento: {
      type: Date
    }
  },
  {
    collection: 'embarcaciones',
    timestamps: true
  }
);

module.exports = mongoose.model('Embarcacion', EmbarcacionSchema);