'use strict';

function index(req, res) {
    res.send(JSON.stringify({ "status": 200, "error": 'On dashboard' }));
}

export {
    index
};