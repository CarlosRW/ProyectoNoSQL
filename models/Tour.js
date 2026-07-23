const mongoose = require('mongoose');

const ModalidadPrivadaSchema = new mongoose.Schema(
  {
    disponible: { type: Boolean, default: false },
    precio_base: { type: Number, default: 0 },
    cobro_extra_por_persona: { type: Number, default: 0 }
  },
  { _id: false }
);

const TourSchema = new mongoose.Schema(
  {
    nombre_tour: {
      type: String,
      required: [true, 'El nombre del tour es obligatorio'],
      trim: true
    },
    tipo: {
      type: String,
      required: true,
      enum: ['grupal', 'privado', 'mixto']
    },
    tarifa_individual: {
      type: Number,
      required: true
    },
    tarifa_con_transporte: {
      type: Number,
      default: 0
    },
    modalidad_privada: ModalidadPrivadaSchema,
    incluye: [{ type: String }],
    duracion_horas: {
      type: Number,
      required: true
    },
    activo: {
      type: Boolean,
      default: true
    }
  },
  {
    collection: 'tours_catalogo',
    timestamps: true
  }
);

module.exports = mongoose.model('Tour', TourSchema);