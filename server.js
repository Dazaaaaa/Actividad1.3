const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS para GitHub Codespaces
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Configuración PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'admin123',
  database: process.env.DB_NAME || 'entidad_db'
});

app.use(express.json());

// ========== ENDPOINTS ==========

// 1. Inicio
app.get('/', (req, res) => {
  res.json({
    mensaje: '🚀 API de Entidad - Funcionando en Codespaces',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      init: 'GET /init',
      productos: {
        crear: 'POST /productos',
        listar: 'GET /productos',
        obtener: 'GET /productos/:id',
        actualizar: 'PUT /productos/:id',
        eliminar: 'DELETE /productos/:id'
      }
    }
  });
});

// 2. Health Check
app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      estado: 'OK',
      baseDatos: 'Conectada',
      timestamp: result.rows[0].now,
      codespace: process.env.CODESPACE_NAME || 'local'
    });
  } catch (error) {
    res.status(500).json({
      estado: 'ERROR',
      baseDatos: 'Desconectada',
      error: error.message
    });
  }
});

// 3. Inicializar Base de Datos
app.get('/init', async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS productos (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        descripcion TEXT,
        precio DECIMAL(10,2) NOT NULL,
        stock INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    res.json({ 
      mensaje: '✅ Tabla productos creada exitosamente',
      nota: 'Ahora puedes crear productos usando POST /productos'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. CREAR producto (CREATE)
app.post('/productos', async (req, res) => {
  const { nombre, descripcion, precio, stock } = req.body;
  
  if (!nombre || !precio) {
    return res.status(400).json({ 
      error: 'Los campos nombre y precio son obligatorios' 
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO productos (nombre, descripcion, precio, stock) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [nombre, descripcion || null, precio, stock || 0]
    );
    res.status(201).json({
      mensaje: '✅ Producto creado',
      producto: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. LISTAR todos los productos (READ)
app.get('/productos', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM productos ORDER BY id'
    );
    res.json({
      total: result.rows.length,
      productos: result.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. OBTENER un producto por ID (READ)
app.get('/productos/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query(
      'SELECT * FROM productos WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: `Producto con ID ${id} no encontrado` 
      });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. ACTUALIZAR producto (UPDATE)
app.put('/productos/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, stock } = req.body;
  
  try {
    const result = await pool.query(
      `UPDATE productos 
       SET nombre = COALESCE($1, nombre),
           descripcion = COALESCE($2, descripcion),
           precio = COALESCE($3, precio),
           stock = COALESCE($4, stock),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [nombre, descripcion, precio, stock, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: `Producto con ID ${id} no encontrado` 
      });
    }
    
    res.json({
      mensaje: '✅ Producto actualizado',
      producto: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 8. ELIMINAR producto (DELETE)
app.delete('/productos/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query(
      'DELETE FROM productos WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: `Producto con ID ${id} no encontrado` 
      });
    }
    
    res.json({
      mensaje: '✅ Producto eliminado',
      producto: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📊 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Acceso: http://0.0.0.0:${PORT}`);
  if (process.env.CODESPACE_NAME) {
    console.log(`☁️  Codespace: ${process.env.CODESPACE_NAME}`);
  }
});
