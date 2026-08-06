# 🌊 Sistema de Gestión y Análisis Transaccional - Rolvin Tours

Aplicación web transaccional diseñada para centralizar las operaciones operativas y financieras de **Rolvin Tours**, una empresa de turismo marino ubicada en Cóbano, Puntarenas, Costa Rica. Proyecto desarrollado para el curso de Bases de Datos No Relacionales, Facultad de Ingeniería en Sistemas de Computación, Universidad Fidélitas.

Profesor: **Mario Alberto Jiménez Espinoza**

---

## 👥 Integrantes del Equipo

| Nombre | Correo | GitHub
|---|---|---|
| Carlos Eduardo Ramírez Wong | cramirez10867@ufide.ac.cr | CarlosRW |
| Nataly Camareno Espinoza | ncamareno10081@ufide.ac.cr | NatalyCamareno |
| María Paula Calvo Gamboa | mcalvo60700@ufide.ac.cr | paulaufide |
| Ricardo Jara Quirós | rjara80940@ufide.ac.cr | RicardoJaraQ |
| Carlos Steven Gálvez Navarro | cgalvez30381@ufide.ac.cr | StevenGalvezz |
| Richard Herrera Mora | rherrera50066@ufide.ac.cr |  |

---

## 🛠️ Stack Tecnológico

* **Frontend:** HTML5, Bootstrap 5, Bootstrap Icons, jQuery (consumo de API vía AJAX)
* **Backend:** Node.js, Express 5
* **Base de Datos:** MongoDB Atlas (NoSQL, orientada a documentos) con Mongoose como ODM
* **Herramientas:** Nodemon (recarga en desarrollo), Thunder Client / DevTools (pruebas de API)

---

## 📦 Módulos y colecciones

El sistema consolida 12 colecciones según el diseño de base de datos del proyecto. Esta entrega implementa CRUD completo (Crear, Leer, Actualizar, Eliminar) sobre 4 de ellas:

| Módulo | Colección | Descripción |
|---|---|---|
| Tours | `tours_catalogo` | Catálogo de paquetes turísticos, tarifas y modalidades |
| Clientes | `clientes` | Registro de turistas nacionales y extranjeros |
| Vendedores | `vendedores` | Intermediarios comerciales y comisionistas externos |
| Embarcaciones | `embarcaciones` | Flota marítima de la empresa y su estado operativo |
| Modulo | `modulo` | descripción |
| Modulo | `modulo` | descripción |
| Modulo | `modulo` | descripción |
| Modulo | `modulo` | descripción |
| Modulo | `modulo` | descripción |
| Modulo | `modulo` | descripción |
| Modulo | `modulo` | descripción |
| Modulo | `modulo` | descripción |

Cada módulo tiene su propia vista HTML, con formulario de creación/edición, tabla de registros, modal de detalle y confirmación de borrado.

---

## 📁 Estructura del Proyecto

```
ProyectoNoSQL/
├── config/
│   └── db.js                  # Conexión a MongoDB con Mongoose
├── models/                    # Esquemas de Mongoose
│   ├── Tour.js
│   ├── Cliente.js
│   ├── Vendedor.js
│   └── Embarcacion.js
├── routes/                    # Rutas REST (CRUD) por módulo
│   ├── tourRoutes.js
│   ├── clienteRoutes.js
│   ├── vendedorRoutes.js
│   └── embarcacionRoutes.js
├── front/
│   ├── css/
│   │   └── style.css          # Tema visual personalizado (extiende Bootstrap)
│   ├── js/
│   │   ├── config.js          # URL base de la API
│   │   ├── model/             # Funciones AJAX (fetch/CRUD) por módulo
│   │   │   ├── toursModel.js
│   │   │   ├── clientesModel.js
│   │   │   ├── vendedoresModel.js
│   │   │   └── embarcacionesModel.js
│   │   ├── tours.js           # Lógica de UI (render, eventos) por módulo
│   │   ├── clientes.js
│   │   ├── vendedores.js
│   │   └── embarcaciones.js
│   └── view/                  # Páginas HTML
│       ├── index.html         # Menú principal
│       ├── tours.html
│       ├── clientes.html
│       ├── vendedores.html
│       └── embarcaciones.html
├── .env.example                # Plantilla de variables de entorno
├── server.js                   # Punto de entrada del servidor Express
└── package.json
```

---

## 🚀 Instalación y ejecución local

### 1. Clonar el repositorio
```bash
git clone https://github.com/CarlosRW/ProyectoNoSQL.git
cd ProyectoNoSQL
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto (copiando `.env.example`) y completa los valores reales:
```dotenv
PORT=5000
MONGO_URI=mongodb+srv://<usuario>:<password>@cluster0.tqjvtrv.mongodb.net/tours_db?retryWrites=true&w=majority&appName=Cluster0
```
> ⚠️ El `.env` real nunca se sube al repositorio (está en `.gitignore`). Pide la cadena de conexión a un integrante del equipo.

### 4. Levantar el servidor
```bash
npm run dev
```
Si todo está bien configurado, la consola debe mostrar:
```
MongoDB Atlas conectado exitosamente a tours_db
Servidor escuchando en el puerto 5000
```

### 5. Abrir la aplicación
El backend sirve el frontend de forma estática. Abre en el navegador:
```
http://localhost:5000/view/index.html
```

---

## 🔌 Endpoints de la API

Todos los endpoints devuelven y reciben JSON. Base URL: `http://localhost:5000/api`

| Módulo | Método | Endpoint | Descripción |
|---|---|---|---|
| Tours | GET | `/tours` | Lista todos los tours |
| Tours | POST | `/tours` | Crea un nuevo tour |
| Tours | PUT | `/tours/:id` | Actualiza un tour por ID |
| Tours | DELETE | `/tours/:id` | Elimina un tour por ID |
| Clientes | GET / POST | `/clientes` | Lista / crea clientes |
| Clientes | PUT / DELETE | `/clientes/:id` | Actualiza / elimina un cliente |
| Vendedores | GET / POST | `/vendedores` | Lista / crea vendedores |
| Vendedores | PUT / DELETE | `/vendedores/:id` | Actualiza / elimina un vendedor |
| Embarcaciones | GET / POST | `/embarcaciones` | Lista / crea embarcaciones |
| Embarcaciones | PUT / DELETE | `/embarcaciones/:id` | Actualiza / elimina una embarcación |

---

## 📄 Licencia

Proyecto académico desarrollado con fines educativos para la Universidad Fidélitas. Uso no comercial.
