const express = require('express');
const { verifyToken, verifyAdminRole } = require('../middlewares/authentication')
const app = express();
let Category = require('../models/category');

//Show all categories
app.get('/category', verifyToken, (req, res) => {
    Category.find({})
        .sort('description')
        .populate('user', 'name email')
        .exec((err, categories) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            Category.count({}, (err, count) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                res.json({
                    ok: true,
                    categories,
                    count
                });
            });
        });
});


//Show one category by ID
app.get('/category/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    Category.findById(id, (err, categoryDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                message: 'Category not found'
            });
        }
        res.json({
            ok: true,
            category: categoryDB
        });
    });
});


//Create a new category
app.post('/category', verifyToken, (req, res) => {
    let userID = req.user._id;
    let description = req.body.description;

    let category = new Category({
        description,
        user: userID
    });

    category.save((err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            category: categoryDB
        });
    });
});


//Modify a category
app.put('/category/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let description = req.body.description;


    Category.findByIdAndUpdate(id, { description }, { new: true, runValidators: true }, (err, categoryDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            category: categoryDB
        });
    });
});


//Delete a category
app.delete('/category/:id', [verifyToken, verifyAdminRole], (req, res) => {
    let id = req.params.id;
    Category.findOneAndRemove(id, (err, categoryDeleted) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoryDeleted) {
            res.status(400).json({
                ok: false,
                message: 'Category not found'
            });
        }
        res.json({
            ok: true,
            message: 'Category deleted!'
        });
    });
});

module.exports = app;