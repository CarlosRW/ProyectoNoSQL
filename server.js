const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const conectarDB = require('./config/db');
const tourRoutes = require('./routes/tourRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const vendedorRoutes = require('./routes/vendedorRoutes');
const embarcacionRoutes = require('./routes/embarcacionRoutes');
const transporteTerrestreRoutes = require('./routes/transporteTerrestreRoutes');
const personalRoutes = require('./routes/personalRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const salidaOperacionRoutes = require('./routes/salidaOperacionRoutes');
const costoVariableRoutes = require('./routes/costoVariableRoutes');
const comisionLiquidacionRoutes = require('./routes/comisionLiquidacionRoutes');
const usuarioSistemaRoutes = require('./routes/usuarioSistemaRoutes');
const historicoKpiRoutes = require('./routes/historicoKpiRoutes');

const app = express();

// Conectar a la base de datos
conectarDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir el frontend estático (carpeta front/)
app.use(express.static(path.join(__dirname, 'front')));

// Rutas API
app.use('/api/tours', tourRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/vendedores', vendedorRoutes);
app.use('/api/embarcaciones', embarcacionRoutes);
app.use('/api/transporte-terrestre', transporteTerrestreRoutes);
app.use('/api/personal', personalRoutes);
app.use('/api/reservas', reservaRoutes);
app.use('/api/salidas-operaciones', salidaOperacionRoutes);
app.use('/api/costos-variables', costoVariableRoutes);
app.use('/api/comisiones-liquidacion', comisionLiquidacionRoutes);
app.use('/api/usuarios-sistema', usuarioSistemaRoutes);
app.use('/api/historico-kpis', historicoKpiRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});