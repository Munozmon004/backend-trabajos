/// imports IMPORTANTES ///
import express from 'express';
import handlebars from 'express-handlebars';
import dotenv from 'dotenv';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';


import router from './routes/index.js'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Rutas
app.use('/', router);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// MONGO Y SERVIDOR //
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Servidor conectado a MongooseDb si');
    app.listen(PORT, () => {
      console.log(` Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Algo salio mal, error al conectarse al Mongosse Db:', error);
  });
