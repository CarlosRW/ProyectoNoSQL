const express = require('express');
const router = express.Router();
const Tour = require('../models/Tour');

// GET /api/tours — Listar todos los tours
router.get('/', async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json(tours);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los tours', error: error.message });
  }
});

// POST /api/tours — Agregar un nuevo tour
router.post('/', async (req, res) => {
  try {
    const nuevoTour = new Tour(req.body);
    const tourGuardado = await nuevoTour.save();
    res.status(201).json(tourGuardado);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear el tour', error: error.message });
  }
});

// PUT /api/tours/:id — Actualizar un tour por ID
router.put('/:id', async (req, res) => {
  try {
    const tourActualizado = await Tour.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!tourActualizado) {
      return res.status(404).json({ mensaje: 'Tour no encontrado' });
    }

    res.status(200).json(tourActualizado);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar el tour', error: error.message });
  }
});

// DELETE /api/tours/:id — Eliminar un tour por ID
router.delete('/:id', async (req, res) => {
  try {
    const tourEliminado = await Tour.findByIdAndDelete(req.params.id);

    if (!tourEliminado) {
      return res.status(404).json({ mensaje: 'Tour no encontrado' });
    }

    res.status(200).json({ mensaje: 'Tour eliminado correctamente', tour: tourEliminado });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el tour', error: error.message });
  }
});

module.exports = router;