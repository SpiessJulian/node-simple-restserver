//==============================
//Puerto
//==============================
process.env.PORT = process.env.PORT || 3000;


//==============================
//Entorno
//==============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';



//==============================
//Vencimiento del Token
//==============================
//60 s
//60 m
//24 h
//30 days
process.env.TOKEN_EXPIRES = 60 * 60 * 24 * 30;


//==============================
//SEED de autenticación
//==============================
process.env.SEED = process.env.SEED || 'dev-secret';


//==============================
//DB
//==============================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URL;
}

process.env.URLDB = urlDB;