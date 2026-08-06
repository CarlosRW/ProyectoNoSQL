const mongoose = require('mongoose');

const UsuarioSistemaSchema = new mongoose.Schema(
    {
        nombre_usuario: {
            type: String,
            required: [true, 'El nombre de usuario es obligatorio'],
            trim: true,
            unique: true
        },

        rol: {
            type: String,
            required: [true, 'El rol es obligatorio'],
            enum: {
                values: [
                    'gerencia',
                    'operaciones',
                    'ventas',
                    'contabilidad'
                ],
                message: 'El rol seleccionado no es válido'
            }
        },

        password_hash: {
            type: String,
            required: [true, 'La contraseña es obligatoria']
        },

        permisos: [
            {
                type: String,
                enum: {
                    values: [
                        'ver_reportes_financieros',
                        'gestionar_usuarios',
                        'ver_kpis',
                        'gestionar_reservas',
                        'gestionar_inventario',
                        'ver_comisiones'
                    ],
                    message: 'El permiso seleccionado no es válido'
                }
            }
        ],

        ultimo_acceso: {
            type: Date,
            default: null
        }
    },
    {
        collection: 'usuarios_sistema',
        timestamps: true
    }
);

// Nunca exponer el hash de la contraseña en las respuestas JSON
UsuarioSistemaSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret.password_hash;
        return ret;
    }
});

module.exports = mongoose.model('UsuarioSistema', UsuarioSistemaSchema);
