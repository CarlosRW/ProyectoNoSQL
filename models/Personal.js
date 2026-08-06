const mongoose = require('mongoose');

const PersonalSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, 'El nombre es obligatorio'],
            trim: true
        },

        puesto: {
            type: String,
            required: [true, 'El puesto es obligatorio'],
            trim: true,
            enum: {
                values: [
                    'Capitán',
                    'Guía turístico',
                    'Administración',
                    'Conductor',
                    'Mantenimiento',
                    'Otro'
                ],
                message: 'El puesto seleccionado no es válido'
            }
        },

        idiomas: [
            {
                type: String,
                trim: true
            }
        ],

        cedula: {
            type: String,
            required: [true, 'La cédula es obligatoria'],
            trim: true,
            unique: true
        },

        fecha_contratacion: {
            type: Date,
            required: [true, 'La fecha de contratación es obligatoria']
        },

        salario_base: {
            type: Number,
            required: [true, 'El salario base es obligatorio'],
            min: [0, 'El salario base no puede ser negativo']
        }
    },
    {
        collection: 'personal',
        timestamps: true
    }
);

module.exports = mongoose.model('Personal', PersonalSchema);