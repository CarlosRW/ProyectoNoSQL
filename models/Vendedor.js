const mongoose = require('mongoose');

const VendedorSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true
    },
    zona: {
      type: String,
      required: true
    },
    tipo: {
      type: String,
      required: true,
      enum: ['hotel asociado', 'vendedor_externo', 'independiente']
    },
    porcentaje_comision: {
      type: Number,
      required: true
    },
    telefono: {
      type: String,
      required: true
    },
    activo: {
      type: Boolean,
      default: true
    }
  },
  {
    collection: 'vendedores',
    timestamps: true
  }
);

module.exports = mongoose.model('Vendedor', VendedorSchema);