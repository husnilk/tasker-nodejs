const express = require('express');
const { PrismaClient } = require('@prisma/client');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router()
const prisma = new PrismaClient();

/* Get User Profile */
router.get('/', verifyToken, async (req, res, next) =>{   
    var user  = req.user;

    return res.json({
        status: 'success',
        message: 'Data retrieved successfully',
        data : user
    });
});

/* Updated User Profile */
router.post('/', verifyToken, async (req, res, next){
    var userId = req.user.id;

    var email = req.body.email;
    var name = req.body.name;

    var updateUser = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            email : email,
            name: name
        }
    });

    return res.json({
        status: 'success',
        message: 'Data updated successfully',
        data: updatedUser
    })
});

module.exports = router;