import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDatabase = async (): Promise<void> => {
  const MONGO_URI = process.env.MONGODB_URI;

  if (!MONGO_URI) {
    console.error('❌ Error: La variable MONGODB_URI no está definida en el archivo .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ [Database]: Conexión exitosa a MongoDB Atlas (nube)');
    console.log(`📦 Base de datos: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('❌ Error crítico al conectar a MongoDB Atlas:', error);
    process.exit(1);
  }
};
    