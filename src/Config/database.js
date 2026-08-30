import mongoose from 'mongoose';
import 'dotenv/config';

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: 'api-urga'
        });
        console.log("Conectado com sucesso ao banco de dados via Mongoose.");
    } catch (error) {
        console.error("Falha ao conectar ao banco de dados via Mongoose:", error);
        process.exit(1);
    }
};
