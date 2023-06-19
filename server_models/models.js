const mongoose = require('mongoose');

// Definir el esquema del producto
const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
});

// Definir el esquema del carrito de compras
const CartSchema = new mongoose.Schema({
  products: [ProductSchema],
});

// Exportar los modelos
module.exports = {
  Product: mongoose.model('Product', ProductSchema),
  Cart: mongoose.model('Cart', CartSchema),
};
