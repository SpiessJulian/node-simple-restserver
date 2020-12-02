const jwt = require('jsonwebtoken');


//==============================
//Verify Token
//==============================
let verifyToken = (req, res, next) => {
    // using get to get the headers (specifying Authorization to get that header)
    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.user = decoded.user;
        next();
    });
};

//==============================
//Verify Admin Role
//==============================
let verifyAdminRole = (req, res, next) => {
    let user = req.user;

    if (user.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(403).json({
            ok: false,
            message: 'User Unauthorized'
        });
    }
};

module.exports = {
    verifyToken,
    verifyAdminRole
}