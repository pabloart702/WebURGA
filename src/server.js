import express from 'express';
import { PORT_HOST } from './env.js'
const app = express();

const PORT = PORT_HOST;
app.listen(PORT, () => {
    console.log(`API online`);
})