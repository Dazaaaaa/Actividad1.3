# 🚀 API REST con Docker en GitHub Codespaces

API completa con CRUD de productos para usar en GitHub Codespaces + Postman

## 📋 Pasos para GitHub Codespaces

### 1️⃣ Subir archivos a Codespaces

1. Abre tu GitHub Codespace
2. Crea una carpeta: `mkdir entidad-api && cd entidad-api`
3. Sube estos archivos:
   - `Dockerfile`
   - `docker-compose.yml`
   - `server.js`
   - `package.json`
   - `.dockerignore`

### 2️⃣ Levantar Docker en Codespaces

```bash
# En la terminal de Codespaces
docker-compose up -d
```

### 3️⃣ Verificar que está corriendo

```bash
docker-compose ps
```

Deberías ver:
```
NAME          STATUS
entidad-api   Up
```

### 4️⃣ Obtener la URL pública

En Codespaces, cuando expones el puerto 3000, GitHub te da una URL pública.

**Opción A - Desde la terminal:**
```bash
echo "URL: https://${CODESPACE_NAME}-3000.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}"
```

**Opción B - Desde la interfaz:**
1. Click en la pestaña "PORTS" (abajo)
2. Busca el puerto 3000
3. Click derecho → "Make Public"
4. Copia la URL que aparece (algo como: `https://redesigned-happiness-7vppjv55v455hw4xr.github.dev/`)

### 5️⃣ Configurar Postman

Usa la URL pública de Codespaces en todos los endpoints:

**Ejemplo:**
```
https://redesigned-happiness-7vppjv55v455hw4xr.github.dev/
```

## 📡 Endpoints para Postman

### 1. Verificar API
**GET** `https://tu-codespace-url.github.dev/`

### 2. Health Check
**GET** `https://tu-codespace-url.github.dev/health`

### 3. Inicializar BD (EJECUTAR PRIMERO)
**GET** `https://tu-codespace-url.github.dev/init`

### 4. Crear Producto
**POST** `https://tu-codespace-url.github.dev/productos`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "nombre": "Laptop HP",
  "descripcion": "Laptop 15 pulgadas, 8GB RAM",
  "precio": 799.99,
  "stock": 15
}
```

### 5. Listar Productos
**GET** `https://tu-codespace-url.github.dev/productos`

### 6. Obtener Producto por ID
**GET** `https://tu-codespace-url.github.dev/productos/1`

### 7. Actualizar Producto
**PUT** `https://tu-codespace-url.github.dev/productos/1`

**Body:**
```json
{
  "precio": 749.99,
  "stock": 20
}
```

### 8. Eliminar Producto
**DELETE** `https://tu-codespace-url.github.dev/productos/1`

## 🔧 Comandos Útiles en Codespaces

### Ver logs
```bash
docker-compose logs -f
```

### Ver logs solo de la app
```bash
docker-compose logs -f app
```

### Reiniciar
```bash
docker-compose restart
```

### Detener
```bash
docker-compose down
```

### Reconstruir después de cambios
```bash
docker-compose up -d --build
```

## ⚠️ Importante para Codespaces

1. **Hacer el puerto público**: En la pestaña "PORTS", click derecho en puerto 3000 → "Port Visibility" → "Public"

2. **CORS habilitado**: El servidor ya tiene CORS configurado para aceptar peticiones desde Postman

3. **URL correcta**: Asegúrate de usar la URL completa de Codespaces, incluyendo `https://`

## 🐛 Solución de Problemas

### Error 401 No autorizado
**Causa**: El puerto no es público o la URL es incorrecta
**Solución**: 
- Haz el puerto 3000 público en la pestaña PORTS
- Verifica que la URL sea correcta

### Error: Could not connect
**Causa**: Docker no está corriendo
**Solución**: `docker-compose up -d`

### Error: relation productos does not exist
**Causa**: No has inicializado la BD
**Solución**: Ejecuta `GET /init` primero

### La BD no se conecta
**Causa**: PostgreSQL aún está iniciando
**Solución**: Espera 15-20 segundos y vuelve a intentar

## 📝 Ejemplo Completo de Flujo

```bash
# 1. En Codespaces terminal
cd entidad-api
docker-compose up -d
docker-compose ps  # Verificar que esté UP

# 2. Obtener URL
echo "https://${CODESPACE_NAME}-3000.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}"

# 3. En Postman
# GET https://tu-url.github.dev/
# GET https://tu-url.github.dev/health
# GET https://tu-url.github.dev/init
# POST https://tu-url.github.dev/productos (con body)
# GET https://tu-url.github.dev/productos
```

## ✅ Checklist

- [ ] Archivos subidos a Codespaces
- [ ] `docker-compose up -d` ejecutado
- [ ] Puerto 3000 es público
- [ ] URL de Codespaces copiada
- [ ] Endpoint `/init` ejecutado en Postman
- [ ] Productos creados y listados

## 🎯 Respuestas Esperadas

### GET /
```json
{
  "mensaje": "🚀 API de Entidad - Funcionando en Codespaces",
  "version": "1.0.0",
  "endpoints": {...}
}
```

### POST /productos
```json
{
  "mensaje": "✅ Producto creado",
  "producto": {
    "id": 1,
    "nombre": "Laptop HP",
    "precio": "799.99",
    "stock": 15,
    ...
  }
}
```

## 💡 Tips

- La URL de Codespaces cambia cada vez que reinicias el Codespace
- Mantén la pestaña PORTS abierta para ver el estado
- Usa `docker-compose logs -f` si algo falla
- El puerto debe ser público, no privado

¡Listo para usar en GitHub Codespaces! 🚀
