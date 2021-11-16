const express = require('express');
const Users = require('./../models/users_models');
const Joi = require('joi')


// Schema para la validacion de datos con Joi
const schema = Joi.object({
    name    : Joi.string().min(4).max(50).required(),
    email   : Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    company : Joi.string().min(5).required(),
    year    : Joi.number().min(15).max(99).required()  
})

// crea un nuevo usuario por cada vez que entra 
const createUser = async (body) => {
    let user = new Users({
        email       : body.email,
        name        : body.name,
        company     : body.company,
        year        : body.year
    });

    return await user.save()
}

// Actualizar los datos del usuario mediante su email
const upDateUser = async(email, body) => {
    let user = await Users.findOneAndUpdate({"email": email}, {
        $set: {company : body.company}
    },{ new: true})
    return user
}

// Elimina una compañia mediante un email recibido por parametro desde el req.body
const deleteCompany = async (email) => {
    let user = await Users.findOneAndDelete({"email": email});
    return user;
}

// Lista a los usuarios cuya edad esta entre 20 y 30 años
const listUsers = async () => {
    let user = await Users.find({ "year": { $gte: 20, $lte: 30 } });

    return user; 
}

const route_user = express.Router();

// creamos la peticion HTTP GET
route_user.get('/', (req, res) => {
    let result = listUsers();
    result.then( user => {
        res.json(user);
    })
        .catch(err => {
        res.status(400).send(err)
    })
});


// creamos la peticion HTTP POST en donde se crea el usuario mediante el body
route_user.post('/', (req, res) => {
    let body = req.body;

    // Valida los valores ingresados con Joi
    const { value, error } = schema.validate({
        name    : body.name,
        email   : body.email,
        company : body.company,
        year    : body.year
    })

    // Si no existe un error, resuelve la promesa
    if (!error) {
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
        
        return
    }

    res.status(400).send(error)

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
    let body = req.body;
    let params = req.params.email
    let result = upDateUser(params, body)
        
    const { value, error } = schema.validate({company : body.company})

    // una vez valdiado el requirimiento de campo de la compañia, resuelve la promesa
    if (!error) {
        result.then(value => {
            res.json({
                val: value
            })
        }).catch(err => {
            res.status(400).send(err)
        })
        
        return
    }

    res.status(400).send(error)

})

module.exports = route_user