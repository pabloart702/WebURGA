import app from './app.js'
import 'dotenv/config';
import { connectDB } from './Config/database.js';
import ProfileImageService from './Services/profileImageService.js';

const PORT = process.env.PORT || process.env.PORT_HOST || 3000;

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 64) {
    console.error("FATAL: JWT_SECRET não configurado ou muito curto. O servidor não pode iniciar por questões de segurança. Mínimo de 64 caracteres exigido.");
    process.exit(1);
}

connectDB().then(async () => {
    await ProfileImageService.seedDefaultProfiles();

    app.listen(PORT, () => {
        console.log(`API online na porta ${PORT}`);
    });
});