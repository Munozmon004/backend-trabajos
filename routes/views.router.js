import { Router } from 'express';
import Product from '../dao/models/product.model.js';

const router = Router();

router.get('/products', async (req, res) => {
});

// En views.router.js
router.get('/products/:pid', async (req, res) => {
    const product = await Product.findById(req.params.pid).lean();
    if (!product) return res.status(404).render('error', { message: 'Producto no encontrado' });
  
    res.render('productDetail', { product });
});  

router.get('/products', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const filter = {};

    if (query?.includes('category:')) {
      filter.category = query.split('category:')[1];
    } else if (query?.includes('available:')) {
      filter.available = query.split('available:')[1] === 'true';
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {},
      lean: true
    };

    const result = await Product.paginate(filter, options);

    res.render('products', {
      products: result.docs,
      pagination: {
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        totalPages: result.totalPages
      }
    });
  } catch (error) {
    res.status(500).send('Error al cargar productos');
  }
});

export default router;
