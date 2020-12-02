//==============================
//Puerto
//==============================
process.env.PORT = process.env.PORT || 3000;


//==============================
//Entorno
//==============================
process.env.ENV = process.env.ENV || 'dev';


//==============================
//DB
//==============================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://julianmongo:tOQlL0M1kp8YUvNq@cluster0.vxytg.mongodb.net/cafe';
}

process.env.URLDB = urlDB;