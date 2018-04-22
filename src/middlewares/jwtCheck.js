import Promise from 'es6-promise';
import jwt from 'jsonwebtoken';

function getToken(req) {
    switch (true) {
        // Handle token from Authorization header
        case (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'):
            return req.headers.authorization.split(' ')[1];

        // Handle token presented as URI param
        case (req.query && req.query.token):
            return req.query.token;

        // Handle token from request body
        case (req.method === 'POST' && req.body.token):
            return req.body.token;

        // Return null if not found
        default:
            return null;
    }
}


async function guard(req, res, next) {
    const token = getToken(req);

    if (token === null) {
        res.send({ title: 'No token' });
        return next();
    }

    try {
        const decodedToken = await verifyToken(token);
        req.user = {};
        req.user.id = decodedToken.data;
        return next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            res.send({ title: 'Token expire' });
            return next();
        }

        if (err.name === 'JsonWebTokenError') {
            res.send({ title: 'Ivalida Token' });
            return next();
        }

        return next();
    }
}

// Decode JSON Web token
function verifyToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err || !decodedToken) {
                return reject(err);
            }

            return resolve(decodedToken);
        });
    });
}

// Generate JSON Web token with User's Id as payload
function generateToken(userId) {
    const payload = {
        data: userId,
    };

    const options = {
        expiresIn: 3600,
        algorithm: 'HS256',
    };

    return jwt.sign(payload, process.env.JWT_SECRET, options);
}


export {
    getToken,
    guard,
    generateToken
}