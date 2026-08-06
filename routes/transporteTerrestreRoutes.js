const express = require('express');
const router = express.Router();
const TransporteTerrestre = require('../models/TransporteTerrestre');

// GET /api/transporte-terrestre
// Lista todos los vehículos terrestres
router.get('/', async (req, res) => {
    try {
        const transportes = await TransporteTerrestre.find();
        res.status(200).json(transportes);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener los transportes terrestres',
            error: error.message
        });
    }
});

// POST /api/transporte-terrestre
// Crea un nuevo vehículo terrestre
router.post('/', async (req, res) => {
    try {
        const nuevoTransporte = new TransporteTerrestre(req.body);
        const transporteGuardado = await nuevoTransporte.save();

        res.status(201).json(transporteGuardado);
    } catch (error) {
        res.status(400).json({
            mensaje: 'Error al crear el transporte terrestre',
            error: error.message
        });
    }
});

// PUT /api/transporte-terrestre/:id
// Actualiza un vehículo terrestre
router.put('/:id', async (req, res) => {
    try {
        const transporteActualizado =
            await TransporteTerrestre.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!transporteActualizado) {
            return res.status(404).json({
                mensaje: 'Transporte terrestre no encontrado'
            });
        }

        res.status(200).json(transporteActualizado);
    } catch (error) {
        res.status(400).json({
            mensaje: 'Error al actualizar el transporte terrestre',
            error: error.message
        });
    }
});

// DELETE /api/transporte-terrestre/:id
// Elimina un vehículo terrestre
router.delete('/:id', async (req, res) => {
    try {
        const transporteEliminado =
            await TransporteTerrestre.findByIdAndDelete(req.params.id);

        if (!transporteEliminado) {
            return res.status(404).json({
                mensaje: 'Transporte terrestre no encontrado'
            });
        }

        res.status(200).json({
            mensaje: 'Transporte terrestre eliminado correctamente',
            transporte: transporteEliminado
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al eliminar el transporte terrestre',
            error: error.message
        });
    }
});

module.exports = router;