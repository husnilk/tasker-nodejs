var express = require('express');

const router = express.Router();

/* List user task */
router.get('/', verifyToken, (req, res, next) => {

});

/* create user task */
router.post('/', verifyToken, (req, res, next) => {

});

/* view detail user task */
router.get('/:id', verifyToken, (req, res, next) => {

});

/* update user task */
router.put('/:id', verifyToken, (req, res, next) => {

});

/* delete user task */
router.delete('/:id', verifyToken, (req, res, next) => {

});

/* assign member to user task */
router.post('/:id/assign', verifyToken, (req, res, next) => {

});

/* remove member to user task */
router.post('/:id/remove', verifyToken, (req, res, next) => {

});

module.exports = router;