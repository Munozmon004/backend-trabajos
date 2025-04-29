const fs = require('fs').promises;
const path = require('path');

const filePath = path.join(__dirname, '../data/carts.json');

class CartManager {
  constructor() {
    this.path = filePath;
  }

  async _readFile() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      return [];
    }
  }

  async _writeFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  async createCart() {
    const carts = await this._readFile();
    const newCart = {
      id: Date.now().toString(),
      products: []
    };
    carts.push(newCart);
    await this._writeFile(carts);
    return newCart;
  }

  async getCartById(cid) {
    const carts = await this._readFile();
    return carts.find(c => c.id === cid);
  }

  async addProductToCart(cid, pid) {
    const carts = await this._readFile();
    const cart = carts.find(c => c.id === cid);
    if (!cart) return null;

    const productInCart = cart.products.find(p => p.product === pid);
    if (productInCart) {
      productInCart.quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await this._writeFile(carts);
    return cart;
  }
}

module.exports = CartManager;
