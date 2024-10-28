const express = require('express');
const { PrismaClient } = require('@prisma/client');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();
const prisma = new PrismaClient();

/* Get list of subordinates */
router.get('/', verifyToken, async (req, res, next) =>{
    //get userId;
    var userId = req.user.id;

    var members =  await prisma.user.findMany({
        where: {
            supervisor_id: userId
        }
    });

    return res.json({
        status: 'success',
        message: "Data retrieved successfully",
        data : members
    });
});

/* Get detail information of subordinate */
router.get('/list', verifyToken, (req, res, next) => {

})

module.exports = router;