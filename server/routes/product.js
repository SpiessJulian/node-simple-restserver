const express = require('express');
const { verifyToken } = require('../middlewares/authentication')
const _ = require('underscore');
const app = express();
let Product = require('../models/product');


//Get all products
app.get('/product', verifyToken, (req, res) => {
    let from = Number(req.params.from || 0);
    let limit = Number(req.params.limit || 5);
    Product.find({ available: true }, 'name priceU description category user')
        .populate('category', 'description')
        .populate('user', 'name email')
        .skip(from)
        .limit(limit)
        .exec((err, products) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            Product.count({ available: true }, (err, count) => {
                res.json({
                    ok: true,
                    products,
                    count
                });
            });
        });
});

//Get a product by ID
app.get('/product/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    Product.findById(id)
        .populate('category', 'description')
        .populate('user', 'name email')
        .exec((err, productDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productDB) {
                return res.status(400).json({
                    ok: false,
                    message: 'Product not found'
                });
            }
            res.json({
                ok: true,
                product: productDB
            });
        });
});

//Find Products
app.get('/product/find/:term', verifyToken, (req, res) => {
    let term = req.params.term;
    let regex = new RegExp(term, 'i');
    Product.find({ name: regex })
        .populate('category', 'description')
        .exec((err, products) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                products
            });
        });
});



//Create a new product
app.post('/product', verifyToken, (req, res) => {
    let userID = req.user._id;
    let body = req.body;
    let product = new Product({
        name: body.name,
        priceU: body.priceU,
        description: body.description,
        category: body.category,
        user: userID
    });

    product.save((err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            productDB
        });
    });
});

//Update a product
app.put('/product/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'priceU', 'description']);
    Product.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productDB) {
            return res.status(400).json({
                ok: false,
                message: 'Product not found'
            });
        }
        res.json({
            ok: true,
            product: productDB
        });
    });
});

//Update a product
app.delete('/product/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    Product.findByIdAndUpdate(id, { available: false }, { new: true, runValidators: true }, (err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            message: 'Product deleted'
        });
    });
});

module.exports = app;