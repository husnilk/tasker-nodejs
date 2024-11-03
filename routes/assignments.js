const express = require('express');
const { PrismaClient } = require('@prisma/client');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();
const db = new PrismaClient();

/* List user task */
router.get('/', verifyToken, async (req, res, next) => {
  let userId = req.user.id;
  
  let tasks = await db.task.findMany({
    where: {
      supervisor_id: userId
    }
  });
  
  return res.status(200).json({
    status: 'success',
    message: 'Tasks retrieved successfully',
    tasks: tasks
  });
});

/* create user task */
router.post('/', verifyToken, async (req, res, next) => {
  var name = req.body.name;
  var desc = req.body.desc;
  var deliverable = req.body.deliverable;
  var start_date = new Date(req.body.start_date).toISOString();
  var deadline = new Date(req.body.deadline).toISOString();
  
  const createdAssignment = await db.task.create({
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
    message: 'Assigment created successfully',
    data: createdAssignment
  });
});


/* view detail user task */
router.get('/:id', verifyToken, async (req, res, next) => {
  var taskId = Number(req.params.id);
  
  const task = await db.task.findUnique({
    where: {
      id: taskId
    },
    include: {
      Progresses: true,
      Assignments: true
    }
  });
  
  return res.status(200).json({
    status: 'success',
    message: 'Data retrieved successfully',
    task : task
  });
});

/* update user task */
router.put('/:id', verifyToken, async (req, res, next) => {
  var taskId = Number(req.params.id);
  
  var name = req.body.name;
  var desc = req.body.desc;
  var deliverable = req.body.deliverable;
  var start_date = new Date(req.body.start_date).toISOString();
  var deadline = new Date(req.body.deadline).toISOString();
  
  const updatedTask = await db.task.update({
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

/* delete assignments */
router.delete('/:id', verifyToken, async (req, res, next) => {
  var taskId = Number(req.params.id);

  await db.progress.deleteMany({
    where: {
      task_id: taskId
    }
  });

  await db.assignment.deleteMany({
    where: {
      task_id: taskId
    }
  })
  
  const deletedTask = await db.task.delete({
    where: {
      id: taskId
    }
  });
  
  return res.status(200).json({
    status: 'success',
    message: 'Data deleted successfully',
    data: deletedTask
  });
});

/* Mass assign member to user task */
router.post('/:id/mass-assignments', verifyToken, async (req, res, next) => {
  let users = req.body.user_ids;
  let taskId = Number(req.params.id);
  
  for (let i = 0; i < users.length; i++) {
    let userId = users[i];
    let userTask = await db.assignment.create({
      data: {
        user_id: userId,
        task_id: taskId
      }
    });
  }
  
  return res.status(200).json({
    status: 'success',
    message: 'Users assigned successfully',
    users: users
  });
});

/* Assign member to user task */
router.post('/:id/assign', verifyToken, async (req, res, next) => {
  let userId = Number(req.body.user_id);
  let taskId = Number(req.params.id);
  
  let assignment = await db.assignment.create({
    data: {
      user_id: userId,
      task_id: taskId
    }
  });
  
  return res.status(200).json({
    status: 'success',
    message: 'Users assigned successfully',
    users: assignment
  });
});

/* remove member to user task */
router.delete('/:id/remove/:assigmentId', verifyToken, async (req, res, next) => {
  let assigmentId = Number(req.params.assigmentId);
  let userId = Number(req.body.user_id);
  let taskId = Number(req.params.id);
  
  let assigment = await db.assignment.delete({
    where: {
      id: assigmentId,
      user_id: userId,
      task_id: taskId
    }    
  });
  
  return res.status(200).json({
    status: 'success',
    message: 'Users removed successfully',
    users: assigment
  });
});

module.exports = router;