import app from './app';
import { connectDatabase } from './config/database';

const port = process.env.PORT || 3000;

// Levanta el servidor Express de inmediato
app.listen(port, () => {
  console.log(`🚀 Servidor empresarial escuchando en http://localhost:${port} - Versión 2.0 (Deploy CI/CD)`);
  console.log(`📡 Endpoints REST listos en: http://localhost:${port}/api/v1/empleados`);
});

// Intenta conectar a MongoDB sin bloquear la red
connectDatabase();