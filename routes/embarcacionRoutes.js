const express = require('express');
const router = express.Router();
const Embarcacion = require('../models/Embarcacion');

// GET /api/embarcaciones — Listar todas las embarcaciones
router.get('/', async (req, res) => {
  try {
    const embarcaciones = await Embarcacion.find();
    res.status(200).json(embarcaciones);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener las embarcaciones', error: error.message });
  }
});

// POST /api/embarcaciones — Agregar una nueva embarcación
router.post('/', async (req, res) => {
  try {
    const nuevaEmbarcacion = new Embarcacion(req.body);
    const embarcacionGuardada = await nuevaEmbarcacion.save();
    res.status(201).json(embarcacionGuardada);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear la embarcación', error: error.message });
  }
});

// PUT /api/embarcaciones/:id — Actualizar una embarcación por ID
router.put('/:id', async (req, res) => {
  try {
    const embarcacionActualizada = await Embarcacion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!embarcacionActualizada) {
      return res.status(404).json({ mensaje: 'Embarcación no encontrada' });
    }

    res.status(200).json(embarcacionActualizada);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar la embarcación', error: error.message });
  }
});

// DELETE /api/embarcaciones/:id — Eliminar una embarcación por ID
router.delete('/:id', async (req, res) => {
  try {
    const embarcacionEliminada = await Embarcacion.findByIdAndDelete(req.params.id);

    if (!embarcacionEliminada) {
      return res.status(404).json({ mensaje: 'Embarcación no encontrada' });
    }

    res.status(200).json({ mensaje: 'Embarcación eliminada correctamente', embarcacion: embarcacionEliminada });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar la embarcación', error: error.message });
  }
});

module.exports = router;