const express = require('express');
const route_data = express.Router();

route_data.get('/', (req, res) => {
    res.json('GET data');
})

module.exports = route_data

