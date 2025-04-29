const express = require('express');
const app = express();
const port = 8080;

const productRouter = require('./routes/products');
const cartRouter = require('./routes/carts');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);


app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});


