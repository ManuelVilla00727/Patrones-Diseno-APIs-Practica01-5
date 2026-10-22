import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { createEmpleadoRouter } from './routes/empleados.routes';
import { errorHandlerMiddleware } from './middlewares/error.middleware';

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

const empleadoRouter = createEmpleadoRouter();
app.use('/api/v1/empleados', empleadoRouter);
app.use('/api/empleados', empleadoRouter); // Compatibilidad con cliente anterior

// Middleware Interceptor Global de Errores (Reto 2)
app.use(errorHandlerMiddleware);

export default app;