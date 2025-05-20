import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import viewsRouter from './src/routes/views.router.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src', 'public')));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src', 'views'));

app.use('/', viewsRouter);

const httpServer = app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

const io = new Server(httpServer);

let products = [];

io.on('connection', socket => {
  console.log('Cliente conectado');

  socket.emit('productList', products);

  socket.on('addProduct', data => {
    products.push(data);
    io.emit('productList', products);
  });

  socket.on('deleteProduct', id => {
    products = products.filter(p => p.id !== id);
    io.emit('productList', products);
  });
});
