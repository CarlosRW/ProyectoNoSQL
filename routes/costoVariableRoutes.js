const express = require('express');
const router = express.Router();
const CostoVariable = require('../models/CostoVariable');

// GET /api/costos-variables
// Listar todos los costos variables
router.get('/', async (req, res) => {
    try {
        const costosVariables = await CostoVariable.find()
            .populate({
                path: 'salida_id',
                select: 'fecha_salida tour_id',
                populate: { path: 'tour_id', select: 'nombre_tour' }
            })
            .sort({ fecha: -1 });

        res.status(200).json(costosVariables);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener los costos variables',
            error: error.message
        });
    }
});

// POST /api/costos-variables
// Crear un nuevo costo variable
router.post('/', async (req, res) => {
    try {
        const nuevoCostoVariable = new CostoVariable(req.body);
        const costoVariableGuardado = await nuevoCostoVariable.save();

        res.status(201).json(costoVariableGuardado);
    } catch (error) {
        res.status(400).json({
            mensaje: 'Error al crear el costo variable',
            error: error.message
        });
    }
});

// PUT /api/costos-variables/:id
// Actualizar un costo variable por ID
router.put('/:id', async (req, res) => {
    try {
        const costoVariableActualizado = await CostoVariable.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!costoVariableActualizado) {
            return res.status(404).json({
                mensaje: 'Costo variable no encontrado'
            });
        }

        res.status(200).json(costoVariableActualizado);
    } catch (error) {
        res.status(400).json({
            mensaje: 'Error al actualizar el costo variable',
            error: error.message
        });
    }
});

// DELETE /api/costos-variables/:id
// Eliminar un costo variable por ID
router.delete('/:id', async (req, res) => {
    try {
        const costoVariableEliminado = await CostoVariable.findByIdAndDelete(
            req.params.id
        );

        if (!costoVariableEliminado) {
            return res.status(404).json({
                mensaje: 'Costo variable no encontrado'
            });
        }

        res.status(200).json({
            mensaje: 'Costo variable eliminado correctamente',
            costoVariable: costoVariableEliminado
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al eliminar el costo variable',
            error: error.message
        });
    }
});

module.exports = router;
