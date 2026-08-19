import app from './app.js'
import 'dotenv/config';

const PORT = process.env.PORT_HOST;
app.listen(PORT, () => {
    console.log(`API online`);
})