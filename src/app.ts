import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { createEmpleadoRouter } from './routes/empleados.routes';
import { errorHandlerMiddleware } from './middlewares/error.middleware';
import authRoutes from './auth/routes/auth.routes.js';

const app = express();

// 1. Middlewares globales
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// 2. Registrar Rutas (Módulos independientes)
const empleadoRouter = createEmpleadoRouter();
app.use('/api/v1/empleados', empleadoRouter);
app.use('/api/empleados', empleadoRouter); // Compatibilidad con cliente anterior
app.use('/api/v1/auth', authRoutes);

// 3. Middleware Interceptor Global de Errores (Debe ir SIEMPRE al final)
app.use(errorHandlerMiddleware);

export default app;