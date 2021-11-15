const express = require('express');
const mongoose = require('mongoose');
const users = require('./router/users');
const data = require('./router/data');

// conecting DB
mongoose.connect('mongodb://localhost:27017/data')
    .then(() => console.log("Conection success"))
    .catch(err => console.log(`Error: ${err}`))

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//route user
app.use('/api/users', users);

// route data
app.use('/api/data', data)

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening port ${port}`))