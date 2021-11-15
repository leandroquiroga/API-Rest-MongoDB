const express = require('express');
const Users  = require('./../models/users_models')


// crea un nuevo usuario por cada vez que entra 
const createUser = async (body) => {
    let user = new Users({
        email       : body.email,
        name        : body.name,
        company     : body.company,
    });

    return await user.save()
}

// Actualizar los datos del usuario mediante su email
const upDateUser = async(email, body) => {
    let user = await Users.findOneAndUpdate(email, {
        $set: {
            name    : body.name,
            company : body.company
        }
    },{ new: true})
    return user
}

// Elimina una compañia mediante un email recibido por parametro desde el req.body
const deleteCompany = async (email) => {
    let user = await Users.findOneAndDelete(email);
    return user;
}

const route_user = express.Router();

// creamos la peticion HTTP GET
route_user.get('/', (req, res) => {
    res.json('GET Users')
});


// creamos la peticion HTTP POST en donde se crea el usuario mediante el body
route_user.post('/', (req, res) => {
    let body = req.body;
    let result = createUser(body);

    result.then( user => {
        res.json({
            valor: user
        })
    }).catch(err => {
        res.status(400).json({
            error: err
        })
    })

})

// creamos la peticion HTTP DELETE en donde eliminado un usuario mediante su email
route_user.delete('/:email', (req, res) => {
    let result = deleteCompany(req.params.email);
    result.then(() => {
        res.send('Usuario eliminado');
    }).catch( err => {
        res.status(400).send(err)
    })
})
// creamos la peticion HTTP PUT
route_user.put('/:email', (req, res) => {
    let result = upDateUser(req.params.email, req.body)
        
    result.then(value => {
        res.json({
            val: value
        })
    }).catch(err => {
        res.status(400).send(err)
    })
})

module.exports = route_user