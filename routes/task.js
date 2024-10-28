var express = require("express");
var { PrismaClient } = require('@prisma/client');
const verifyToken = require("../middlewares/verifyToken");

var prisma = new PrismaClient();
var router = express.Router();

/* List Our task */
router.get('/', verifyToken, async (req, res, next) =>{
  let userId = req.user.id;

  let tasks = await prisma.task.findMany({
    where: {
      user_id: userId
    }
  });

  return res.json({
    status: 'success',
    message: 'Data retrieved successfully',
    data : tasks
  });

});

/* Create new Task */
router.post('/create', verifyToken, async (req, res, next) => {
  var name = req.body.name;
  var desc = req.body.desc;
  var deliverable = req.body.deliverable;
  var start_date = req.body.start_date;
  var deadline = req.body.deadline;

  const createdUser = await prisma.task.create({
    data: {
      name: name,
      desc: desc,
      deliverable: deliverable,
      status: 1,
      start_date: start_date,
      deadline: deadline,
      supervisor_id : req.user.id
    }
  });

  return res.json({
    status: 'success',
    message: 'Data created successfully',
    data: data
  });
});

/* Show task detail */
router.get('/:id', verifyToken, async (req, res, next) => {
  var taskId = req.params.id;

  const task = await prisma.task.findUnique({
    where: {
      id: taskId
    }
  });

  return res.json({
    status: 'success',
    message: 'Data retrieved successfully',
    task : task
  });
});

/* Update Task Detail */
router.put('/:id', verifyToken, async (req, res, next) => {
  var taskId = req.params.id;

  var name = req.body.name;
  var desc = req.body.desc;
  var deliverable = req.body.deliverable;
  var start_date = req.body.start_date;
  var deadline = req.body.deadline;

  const updatedTask = await prisma.task.update({
    where: {
      id: taskId
    },
    data: {
      name: name,
      desc: desc,
      deliverable: deliverable,
      status: 1,
      start_date: start_date,
      deadline: deadline,
      supervisor_id : req.user.id
    }
  });

  return res.json({
    status: 'success',
    message: 'Data updated successfully',
    data: updatedTask
  });

});

/* Delete Task */
router.delete('/:id', verifyToken, async (req, res, next) => {
  var taskId = req.params.id;

  const deletedTask = await prisma.task.delete({
    where: {
      id: taskId
    }
  });

  return res.json({
    status: 'success',
    message: 'Data deleted successfully',
    data: deletedTask
  });

});

module.exports = router;
