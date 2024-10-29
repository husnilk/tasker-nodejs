const express = require('express')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const bcryptjs = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')

var prisma = new PrismaClient()
var router = express.Router()

/* Authentication */
router.post('/login', async (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;
    
    const user = await prisma.user.findUnique({
        where: {
            username: password
        }
    });
    
    if( user == null ){
        return res.json({
            status: 'failed',
            message: 'Kombinasi username dan password tidak ditemukan'
        });
    }else{
        if(bcryptjs.compareSync(password, user.password)){
            dotenv.config();
            var token = jwt.sign(
                {username: username}, 
                process.env.TOKEN_SECRET, 
                {expiresIn: '1800s'}
            );
            return res.json({
                status: 'success',
                username: username,
                token: token
            })
        }else{
            return res.json({
                status: 'failed',
                message: 'Kombinasi username dan password tidak ditemukan'
            });
        }
    }
});

router.post('/register', async (req, res, next) => {
    var email = req.body.email;
    var name = req.body.name;
    var password = req.body.password;
    
    var encPassword = bcryptjs.hashSync(password, 8);
    
    let createdUser = await prisma.user.create({
        data: {
            email: email,
            name: name,
            password: encPassword,
            supervisor_id: null,
        }
    });
    
    return res.json({
        status: 'success',
        message: 'Data created successfully',
        user: createdUser
    });
    
    
});

module.exports = router;
