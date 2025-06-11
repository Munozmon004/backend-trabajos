import { Router } from 'express';
import Cart from '../dao/models/cart.model.js';

const router = Router();

// carrito vacio
router.post('/', async (req, res) => {
    try {
      const newCart = await Cart.create({ products: [] });
      res.status(201).json({ status: 'success', payload: newCart });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  });

// GET 
router.get('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate('products.product').lean();
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// DELETE eliminar producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();
    res.json({ status: 'success', message: 'Producto eliminado del carrito' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// PUT agrega los productos al carrrito
router.put('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const products = req.body.products; // espera array [{product: id, quantity: num}]

    if (!Array.isArray(products)) {
      return res.status(400).json({ status: 'error', message: 'Formato de productos inválido' });
    }

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    cart.products = products;
    await cart.save();
    res.json({ status: 'success', message: 'Carrito actualizado' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// PUT (2) actaualiza los prdocutos
router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (quantity == null || quantity < 1) {
      return res.status(400).json({ status: 'error', message: 'Cantidad inválida' });
    }

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    const productInCart = cart.products.find(p => p.product.toString() === pid);
    if (!productInCart) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });
    }

    productInCart.quantity = quantity;
    await cart.save();
    res.json({ status: 'success', message: 'Cantidad actualizada' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// DELETE (2) elimina los productos 
router.delete('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    cart.products = [];
    await cart.save();
    res.json({ status: 'success', message: 'Carrito vaciado' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});


export default router;
