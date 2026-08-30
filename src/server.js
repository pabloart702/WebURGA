import app from './app.js'
import 'dotenv/config';
import { connectDB } from './Config/database.js';

const PORT = process.env.PORT_HOST || 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`API online na porta ${PORT}`);
    });
});