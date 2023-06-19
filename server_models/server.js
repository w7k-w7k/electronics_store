const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const port = 27017;
// Crear la aplicación de express
const app = express();
// Conectar a MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/electronics_store', {useNewUrlParser: true, useUnifiedTopology: true});
// Habilitar JSON en express
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  });

// Habilitar CORS
app.use(cors());

const { Product, Cart } = require('./models');

// Ruta para obtener todos los productos
app.get('/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Ruta para buscar productos
app.get('/products/search', async (req, res) => {
  const query = req.query.query;
  const matchingProducts = await Product.find({ name: new RegExp(query, 'i') });
  res.json(matchingProducts);
});

// Ruta para agregar un producto al carrito
app.post('/cart', async (req, res) => {
  const productId = req.body.productId;
  const product = await Product.findById(productId);
  if (product) {
    const cart = await Cart.findOne();
    cart.products.push(product);
    await cart.save();
    res.json(product);
  } else {
    res.status(404).send('Producto no encontrado');
  }
});

// Ruta para eliminar un producto del carrito
app.delete('/cart/:productId', async (req, res) => {
  const productId = req.params.productId;
  const cart = await Cart.findOne();
  const productIndex = cart.products.findIndex(p => p._id.toString() === productId);
  if (productIndex !== -1) {
    cart.products.splice(productIndex, 1);
    await cart.save();
    res.json({ message: 'Producto eliminado del carrito' });
  } else {
    res.status(404).send('Producto no encontrado en el carrito');
  }
});








const initialProducts = [
    {
      name: 'Laptop XYZ',
      description: 'Un portátil muy bueno',
      price: 1000,
    },
    {
      name: 'Audífonos XYZ',
      description: 'Audífonos de alta calidad',
      price: 100,
    },
    
  ];
  
  app.listen(port, async () => {
    console.log(`Server running at http://localhost:${port}`);
  
    // Chequear si ya hay productos en la base de datos
    if ((await Product.countDocuments()) === 0) {
      // Si no hay productos, llenar la base de datos con productos iniciales
      for (let product of initialProducts) {
        const newProduct = new Product(product);
        await newProduct.save();
      }
      console.log('Base de datos llena con productos iniciales');
    }
  
    // Chequear si ya hay un carrito de compras en la base de datos
    if ((await Cart.countDocuments()) === 0) {
      // Si no hay carrito de compras, crear uno
      const newCart = new Cart({ products: [] });
      await newCart.save();
      console.log('Carrito de compras creado');
    }
  });
  

// Escuchar en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
