const express = require('express');
const { PrismaClient } = require('@prisma/client');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();
const prisma = new PrismaClient();

/* Get Supervisor Information Detail */
router.get('/', verifyToken, async (req, res, next) => {

    let supervisorId = req.user.supervisor_id;

    const supervisor = await prisma.user.findUnique({
        where: {
            id: supervisorId
        }
    });

    return res.json({
        status: 'success',
        message: 'Data retrieved successfully',
        supervisor : supervisor
    });

});

module.exports = router;