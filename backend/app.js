const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const extractFile = require('./middleware/file');

const Product = require('./models/product');

const app = express();

// Database connection
mongoose.connect('mongodb+srv://akshay:' + process.env.MONGO_ATLAS_PW  + '@cluster0.mabdu.mongodb.net/add-to-cart?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to Database!');
  })
  .catch(() => {
    console.log('Connection failed!');
  });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// images folder permission
app.use('/images', express.static(path.join('backend/images')));


// Middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});

// Get products
app.get('/api/products', (req, res, next) => {
  Product.find().then(result => {
    res.status(200).json({
      message: 'Product Fetched successfully!',
      products: result
    });
  });
});

// Get single product
app.get('/api/products/:id', (req, res, next) => {
  Product.findOne().then(result => {
    res.status(200).json({
      product: result
    });
  })
})

// Add product
app.post('/api/products', extractFile, (req, res, next) => {
  console.log(req.file.originalname);
  const url = req.protocol + '://' + req.get('host');
  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    productImgPath: url + '/images/' + req.file.filename
  });
  product.save().then(result => {
    console.log(result);
    res.status(201).json({
      message: 'Product added successfully!'
    });
  });
});

module.exports = app;
