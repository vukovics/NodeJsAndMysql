'use strict';

import connection from '../database';
import Promise from 'es6-promise';

function getUserByEmail(email) {
    return new Promise(resolve => {
        connection.query('SELECT * FROM USERS WHERE email = ?', [email], (err, response) => {
            resolve(response);
        })
    });
}


export {
    getUserByEmail
};