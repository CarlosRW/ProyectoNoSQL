const express = require('express');
const router = express.Router();
const Personal = require('../models/Personal');

// GET /api/personal
// Listar todos los registros de personal
router.get('/', async (req, res) => {
    try {
        const personal = await Personal.find().sort({ nombre: 1 });

        res.status(200).json(personal);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener el personal',
            error: error.message
        });
    }
});

// POST /api/personal
// Crear un nuevo registro de personal
router.post('/', async (req, res) => {
    try {
        const nuevoPersonal = new Personal(req.body);
        const personalGuardado = await nuevoPersonal.save();

        res.status(201).json(personalGuardado);
    } catch (error) {
        res.status(400).json({
            mensaje: 'Error al crear el registro de personal',
            error: error.message
        });
    }
});

// PUT /api/personal/:id
// Actualizar un registro de personal
router.put('/:id', async (req, res) => {
    try {
        const personalActualizado = await Personal.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!personalActualizado) {
            return res.status(404).json({
                mensaje: 'Registro de personal no encontrado'
            });
        }

        res.status(200).json(personalActualizado);
    } catch (error) {
        res.status(400).json({
            mensaje: 'Error al actualizar el registro de personal',
            error: error.message
        });
    }
});

// DELETE /api/personal/:id
// Eliminar un registro de personal
router.delete('/:id', async (req, res) => {
    try {
        const personalEliminado = await Personal.findByIdAndDelete(
            req.params.id
        );

        if (!personalEliminado) {
            return res.status(404).json({
                mensaje: 'Registro de personal no encontrado'
            });
        }

        res.status(200).json({
            mensaje: 'Registro de personal eliminado correctamente',
            personal: personalEliminado
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al eliminar el registro de personal',
            error: error.message
        });
    }
});

module.exports = router;