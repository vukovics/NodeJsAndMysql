'use strict';

import connection from '../database';
import bcrypt from 'bcrypt';
import * as jwtCheck from '../middlewares/jwtCheck';
import * as UserController from '../controllers/UserController';

async function register(req, res, next) {
    /* Register user */
    const user = req.body;
    const saltRounds = 10;
    let cryptedPass;

    user.code = Math.random().toString(36);
    user.verified = 0;

    // Hash User's password
    try {
        cryptedPass = await bcrypt.hash(user.password, saltRounds);
    } catch (err) {
        throw err;
    }

    user.password = cryptedPass;

    try {
        connection.query('INSERT INTO users SET ?', user, (err) => {
            if (err) {
                res.send(JSON.stringify({ "status": 200, "error": err.sqlMessage }));
                return next();
            }
            res.send(JSON.stringify({ "status": 200, "error": null, "response": true }));
            return next();
        });
    } catch (err) {
        res.send(JSON.stringify({ "status": 200, "error": 'Error', "response": true }));
        return next();
    }
}


async function login(req, res, next) {
    //Get user
    const user = await UserController.getUserByEmail(req.body.email, req.body.password);

    //User don't exist
    if (user.length === 0) {
        res.send(JSON.stringify(
            {
                "status": 200,
                "error": 'Wrong email or password',
                "response": true
            }
        ));
        return next();
    }

    //User not verifiled
    if (user[0].verified === 0) {
        res.send(JSON.stringify(
            {
                "status": 200,
                "error": 'Not Verified',
                "response": true
            }
        ));
        return next();
    }

    //Check password hash
    bcrypt.compare(req.body.password, user[0].password, function (err, passwordValidation) {
        if (passwordValidation) {
            res.send(JSON.stringify(
                {
                    "status": 200,
                    "error": null,
                    "response": true,
                    token: jwtCheck.generateToken(user[0].id)
                }
            ));
        } else {
            res.send(JSON.stringify(
                {
                    "status": 200,
                    "error": 'Wrong email or password',
                    "response": true
                }
            ));
        }
    });
}

export {
    register,
    login
};