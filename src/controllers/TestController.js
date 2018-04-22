import connection from '../database';

function getTest(req, res) {
    /* Get ll Users */
    connection.query('SELECT * FROM users', function (err, rows) {
        if (err) throw err;
        res.send(rows);
    });
    connection.end();
}

export {
    getTest,
};