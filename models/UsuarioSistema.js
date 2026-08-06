const mongoose = require('mongoose');

const UsuarioSistemaSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, 'El nombre es obligatorio'],
            trim: true
        },

        correo: {
            type: String,
            required: [true, 'El correo es obligatorio'],
            trim: true,
            lowercase: true
        },

        usuario: {
            type: String,
            required: [true, 'El usuario es obligatorio'],
            trim: true,
            unique: true
        },

        contrasena: {
            type: String,
            required: [true, 'La contraseña es obligatoria'],
            minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
        },

        rol: {
            type: String,
            required: [true, 'El rol es obligatorio'],
            enum: {
                values: [
                    'administrador',
                    'operaciones',
                    'ventas',
                    'contabilidad'
                ],
                message: 'El rol seleccionado no es válido'
            }
        },

        estado: {
            type: String,
            required: [true, 'El estado es obligatorio'],
            enum: {
                values: ['activo', 'inactivo'],
                message: 'El estado seleccionado no es válido'
            },
            default: 'activo'
        }
    },
    {
        collection: 'usuarios_sistema',
        timestamps: true
    }
);

module.exports = mongoose.model('UsuarioSistema', UsuarioSistemaSchema);