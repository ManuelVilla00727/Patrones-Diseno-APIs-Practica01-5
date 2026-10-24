import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Definimos el esquema directamente aquí para evitar problemas de importación
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  rol: { type: String, default: 'alumno' }
}, { timestamps: true });

const UserModel = mongoose.model('User', UserSchema);

const crearUsuario = async () => {
  try {
    console.log('Conectando a MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado.');

    // 1. Verificar si el usuario ya existe
    const existe = await UserModel.findOne({ email: 'admin@test.com' });
    if (existe) {
      console.log('⚠️ El usuario admin@test.com ya existe.');
      process.exit(0);
    }

    // 2. Generar el hash de la contraseña
    const hash = await bcrypt.hash('123456', 10);

    // 3. Crear el usuario
    await UserModel.create({
      email: 'admin@test.com',
      password: hash,
      rol: 'admin'
    });

    console.log('✅ Usuario admin@test.com creado exitosamente con contraseña 123456');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

crearUsuario();