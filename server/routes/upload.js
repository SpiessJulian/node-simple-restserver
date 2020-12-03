const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const app = express();
const User = require('../models/user');
const Product = require('../models/product');

app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:type/:id', (req, res) => {
    let type = req.params.type;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No files selected'
            }
        });
    }

    //Types validations
    let validTypes = ['products', 'users'];
    if (validTypes.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Allowed types: ' + validTypes.join(', ')
            }
        });
    }

    let file = req.files.file;
    let nameSplitted = file.name.split('.');
    let ext = nameSplitted[nameSplitted.length - 1];

    //Allowed Extensions
    let allowedExtensions = ['png', 'jpg', 'gif', 'jpeg'];

    if (allowedExtensions.indexOf(ext) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Allowed Extensions: ' + allowedExtensions.join(', ')
            }
        });
    }

    //Change filename
    let filename = `${id}-${new Date().getMilliseconds()}.${ext}`;

    file.mv(`uploads/${type}/${filename}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        switch (type) {
            case 'users':
                userImage(id, res, filename);
                break;
            case 'products':
                productImage(id, res, filename);
                break;
            default:
                userImage(id, res, filename);
        }

    });
});


function userImage(id, res, filename) {
    User.findById(id, (err, userDB) => {
        if (err) {
            deleteFile(filename, 'users');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!userDB) {
            deleteFile(filename, 'users');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User not found'
                }
            });
        }

        deleteFile(userDB.img, 'users');

        userDB.img = filename;

        userDB.save((err, userSaved) => {
            res.json({
                ok: true,
                user: userSaved,
                img: filename
            });
        });
    });
}

function productImage(id, res, filename) {
    Product.findById(id, (err, productDB) => {
        if (err) {
            deleteFile(filename, 'products');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productDB) {
            deleteFile(filename, 'products');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Product not found'
                }
            });
        }
        deleteFile(productDB.img, 'products');

        productDB.img = filename;

        productDB.save((err, productSaved) => {
            res.json({
                ok: true,
                product: productSaved,
                img: filename
            });
        });
    });
}

function deleteFile(filename, type) {
    let pathImg = path.resolve(__dirname, `../../uploads/${type}/${filename}`);
    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }
}


module.exports = app;