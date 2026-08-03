const express = require('express');
const router = express.Router();
const Vendedor = require('../models/Vendedor');

// GET /api/vendedores — Listar todos los vendedores
router.get('/', async (req, res) => {
  try {
    const vendedores = await Vendedor.find();
    res.status(200).json(vendedores);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los vendedores', error: error.message });
  }
});

// POST /api/vendedores — Agregar un nuevo vendedor
router.post('/', async (req, res) => {
  try {
    const nuevoVendedor = new Vendedor(req.body);
    const vendedorGuardado = await nuevoVendedor.save();
    res.status(201).json(vendedorGuardado);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear el vendedor', error: error.message });
  }
});

// PUT /api/vendedores/:id — Actualizar un vendedor por ID
router.put('/:id', async (req, res) => {
  try {
    const vendedorActualizado = await Vendedor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!vendedorActualizado) {
      return res.status(404).json({ mensaje: 'Vendedor no encontrado' });
    }

    res.status(200).json(vendedorActualizado);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar el vendedor', error: error.message });
  }
});

// DELETE /api/vendedores/:id — Eliminar un vendedor por ID
router.delete('/:id', async (req, res) => {
  try {
    const vendedorEliminado = await Vendedor.findByIdAndDelete(req.params.id);

    if (!vendedorEliminado) {
      return res.status(404).json({ mensaje: 'Vendedor no encontrado' });
    }

    res.status(200).json({ mensaje: 'Vendedor eliminado correctamente', vendedor: vendedorEliminado });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el vendedor', error: error.message });
  }
});

module.exports = router;