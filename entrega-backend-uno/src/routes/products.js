const express = require('express');
const router = express.Router();

let products = []; // Aquí simulamos una base de datos temporal
let currentId = 1;

// GET /api/products/
router.get('/', (req, res) => {
  res.json(products);
});

// GET /api/products/:pid
router.get('/:pid', (req, res) => {
  const product = products.find(p => p.id == req.params.pid);
  if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
  res.json(product);
});

// POST /api/products/
router.post('/', (req, res) => {
  const { title, description, code, price, status, stock, category, thumbnails } = req.body;

  const newProduct = {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT /api/products/:pid
router.put('/:pid', (req, res) => {
  const index = products.findIndex(p => p.id == req.params.pid);
  if (index === -1) return res.status(404).json({ message: 'Producto no encontrado' });

  const updatedFields = req.body;
  delete updatedFields.id; // Aseguramos que no se actualice el id

  products[index] = { ...products[index], ...updatedFields };
  res.json(products[index]);
});

// DELETE /api/products/:pid
router.delete('/:pid', (req, res) => {
  const index = products.findIndex(p => p.id == req.params.pid);
  if (index === -1) return res.status(404).json({ message: 'Producto no encontrado' });

  const deleted = products.splice(index, 1);
  res.json({ message: 'Producto eliminado', deleted });
});

module.exports = router;
