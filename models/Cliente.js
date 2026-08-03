const mongoose = require('mongoose');

const ClienteSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true
    },
    nacionalidad: {
      type: String,
      required: true
    },
    tipo_cliente: {
      type: String,
      required: true,
      enum: ['nacional', 'extranjero']
    },
    telefono: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    alojamiento: {
      type: String,
      default: ''
    },
    fecha_registro: {
      type: Date,
      default: Date.now
    }
  },
  {
    collection: 'clientes',
    timestamps: true
  }
);

module.exports = mongoose.model('Cliente', ClienteSchema);