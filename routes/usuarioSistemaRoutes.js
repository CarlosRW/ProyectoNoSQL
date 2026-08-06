const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const UsuarioSistema = require('../models/UsuarioSistema');

const RONDAS_SAL = 10;

// GET /api/usuarios-sistema
// Listar todos los usuarios del sistema
router.get('/', async (req, res) => {
    try {
        const usuarios = await UsuarioSistema.find().sort({ nombre_usuario: 1 });

        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener los usuarios del sistema',
            error: error.message
        });
    }
});

// POST /api/usuarios-sistema
// Crear un nuevo usuario del sistema
router.post('/', async (req, res) => {
    try {
        const { contrasena, ...datosUsuario } = req.body;

        if (!contrasena) {
            return res.status(400).json({
                mensaje: 'La contraseña es obligatoria'
            });
        }

        datosUsuario.password_hash = await bcrypt.hash(contrasena, RONDAS_SAL);

        const nuevoUsuario = new UsuarioSistema(datosUsuario);
        const usuarioGuardado = await nuevoUsuario.save();

        res.status(201).json(usuarioGuardado);
    } catch (error) {
        res.status(400).json({
            mensaje: 'Error al crear el usuario del sistema',
            error: error.message
        });
    }
});

// PUT /api/usuarios-sistema/:id
// Actualizar un usuario del sistema por ID
router.put('/:id', async (req, res) => {
    try {
        const { contrasena, ...datosUsuario } = req.body;

        // Solo se actualiza la contraseña si se envía una nueva
        if (contrasena) {
            datosUsuario.password_hash = await bcrypt.hash(contrasena, RONDAS_SAL);
        }

        const usuarioActualizado = await UsuarioSistema.findByIdAndUpdate(
            req.params.id,
            datosUsuario,
            {
                new: true,
                runValidators: true
            }
        );

        if (!usuarioActualizado) {
            return res.status(404).json({
                mensaje: 'Usuario del sistema no encontrado'
            });
        }

        res.status(200).json(usuarioActualizado);
    } catch (error) {
        res.status(400).json({
            mensaje: 'Error al actualizar el usuario del sistema',
            error: error.message
        });
    }
});

// DELETE /api/usuarios-sistema/:id
// Eliminar un usuario del sistema por ID
router.delete('/:id', async (req, res) => {
    try {
        const usuarioEliminado = await UsuarioSistema.findByIdAndDelete(
            req.params.id
        );

        if (!usuarioEliminado) {
            return res.status(404).json({
                mensaje: 'Usuario del sistema no encontrado'
            });
        }

        res.status(200).json({
            mensaje: 'Usuario del sistema eliminado correctamente',
            usuario: usuarioEliminado
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al eliminar el usuario del sistema',
            error: error.message
        });
    }
});

module.exports = router;
