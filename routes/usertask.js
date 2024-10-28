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


/* view detail user task */
router.get('/:id', verifyToken, async (req, res, next) => {
    var taskId = req.params.id;

  const task = await prisma.task.findUnique({
    where: {
      id: taskId
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

/* delete user task */
router.delete('/:id', verifyToken, async (req, res, next) => {
    var taskId = req.params.id;

  const deletedTask = await prisma.task.delete({
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

/* assign member to user task */
router.post('/:id/assign', verifyToken, async (req, res, next) => {
    let users = req.body.users;
    let taskId = req.params.id;

    for (let i = 0; i < users.length; i++) {
        let userId = users[i];
        let userTask = await db.userTask.create({
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

/* remove member to user task */
router.post('/:id/remove', verifyToken, (req, res, next) => {
    let users = req.body.users;
    let taskId = req.params.id;
    
    for (let i = 0; i < users.length; i++) {
        let userId = users[i];
        db.userTask.delete({
            where: {
                user_id: userId,
                task_id: taskId
            }    
        });
    }

    return res.status(200).json({
        status: 'success',
        message: 'Users removed successfully',
        users: users
    });
});

module.exports = router;