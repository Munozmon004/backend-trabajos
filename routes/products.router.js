import express from 'express';
import Product from '../dao/models/product.model.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Recibir query params con valores por defecto
    let { limit = 10, page = 1, sort, query } = req.query;
    limit = parseInt(limit);
    page = parseInt(page);

    // Construir filtro
    let filter = {};
    if (query) {
      // Puedes buscar por categoría o disponibilidad, por ejemplo:
      // Si query es "category:Electronics"
      // o "available:true"
      // Para simplificar, asumamos que query es el nombre de la categoría o "available:true"
      // Puedes mejorar esto con un parseo más avanzado si quieres.

      // Ejemplo sencillo: si query es "category:Electronics"
      if (query.includes('category:')) {
        const category = query.split('category:')[1];
        filter.category = category;
      } else if (query.includes('available:')) {
        const available = query.split('available:')[1];
        filter.available = available === 'true';
      } else {
        // si quieres buscar por nombre o algo más, puedes agregar aquí
      }
    }

    // Construir opción sort
    let sortOption = {};
    if (sort === 'asc') sortOption.price = 1;
    else if (sort === 'desc') sortOption.price = -1;

    // Usar paginación con mongoose-paginate-v2 o con skip/limit manual
    // Aquí un ejemplo usando skip/limit:
    const totalDocs = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalDocs / limit);

    if(page > totalPages && totalPages > 0) page = totalPages;

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Generar links prevLink y nextLink
    const baseUrl = `/api/products?limit=${limit}`;
    const prevPage = page > 1 ? page - 1 : null;
    const nextPage = page < totalPages ? page + 1 : null;

    const prevLink = prevPage ? `${baseUrl}&page=${prevPage}` + (sort ? `&sort=${sort}` : '') + (query ? `&query=${query}` : '') : null;
    const nextLink = nextPage ? `${baseUrl}&page=${nextPage}` + (sort ? `&sort=${sort}` : '') + (query ? `&query=${query}` : '') : null;

    res.json({
      status: 'success',
      payload: products,
      totalPages,
      prevPage,
      nextPage,
      page,
      hasPrevPage: prevPage !== null,
      hasNextPage: nextPage !== null,
      prevLink,
      nextLink,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// GET

router.get('/:pid', async (req, res) => {
  console.log('ID recibido:', req.params.pid);
  try {
    const product = await Product.findById(req.params.pid);
    if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    res.json({ status: 'success', payload: product });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});
// POST 
router.post('/', async (req, res) => {
  try {
    const { title, description, price, stock, thumbnail, category } = req.body;

    if (!title || !price || !stock) {
      return res.status(400).json({ status: 'error', message: 'Faltan campos obligatorios' });
    }

    const newProduct = new Product({
      title,
      description,
      price,
      stock,
      thumbnail,
      category
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({ status: 'success', payload: savedProduct });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});
// POST (2)
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.status(201).json({ status: 'success', payload: saved });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
});
// PUT 
router.put('/:pid', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });
    if (!updatedProduct) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    res.json({ status: 'success', payload: updatedProduct });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});
// DELETE 
router.delete('/:pid', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.pid);
    if (!deletedProduct) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    res.json({ status: 'success', payload: deletedProduct });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});



export default router;
