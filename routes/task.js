var express = require("express");
var { PrismaClient } = require("@prisma/client");
const verifyToken = require("../middlewares/verifyToken");

var db = new PrismaClient();
var router = express.Router();

/* List Our task */
router.get("/", verifyToken, async (req, res, next) => {
  let userId = req.user.id;
  
  let tasks = await db.task.findMany({
    where: {
        Assignments: {
          some: {
            user_id: userId
          }
        }
    },
    select: {
      id: true,
      name: true,
      desc: true,
      deliverable: true,
      status: true,
      _count: {
        select:{
          Progresses: true
        }
      }
    }
  });

  tasks.map((task) => {
    task.Progresses = task._count.Progresses;
    delete(task._count);
  })
  
  return res.json({
    status: "success",
    message: "Data retrieved successfully",
    data: tasks
  });
});


/* Show task detail */
router.get("/:id", verifyToken, async (req, res, next) => {
  var taskId = Number(req.params.id);
  
  const task = await db.task.findUnique({
    where: {
      id: taskId,
    },
    select: {
      id: true,
      name: true,
      desc: true,
      deliverable: true,
      status: true,
      start_date: true,
      deadline: true,
      percentage: true,
      supervisor_id: true,
      supervisor: {
        select: {
          id: true,
          name: true,
        },
      },
      Progresses: {
        select: {
          id: true,
          user_id: true,
          task_id: true,
          achievement: true,
          problem: true,
          next_plan: true,
          percentage: true,
        },
      },
    },
  });
  
  return res.json({
    status: "success",
    message: "Data retrieved successfully",
    task: task,
  });
});


/* Add progress */
router.post('/:taskId/progress', verifyToken, async (req, res, next) => {
  let taskId = Number(req.params.taskId)
  let userId = Number(req.user.id)

  console.log(taskId, userId);
  
  let achievement = req.body.achievement;
  let problem = req.body.problem;
  let next_plan = req.body.next_plan;
  let percentage = Number(req.body.percentage)
  
  const progress = await db.progress.create({
    data: {
      user_id: userId,
      task_id: taskId,
      achievement: achievement,
      problem: problem,
      next_plan: next_plan,
      percentage: percentage
    }
  })
  
  return res.json({
    status: 'success',
    message: 'Data created successfully',
    progress: progress
  });
});

/* Get Progress Detail */
router.get('/:taskId/progress/:id', verifyToken, async (req, res, next) => {
  
  let progressId = Number(req.params.id)
  let taskId = Number(req.params.taskId)
  
  let progress = await db.progress.findUnique({
    where: {
      task_id : taskId,
      id: progressId
    }
  });
  
  return res.json({
    status: 'success',
    message: 'Progress retrieved successfully',
    progress : progress
  });
  
});

/* Update Progress */
router.put('/:taskId/progress/:id', verifyToken, async (req, res, next) => {
  var taskId = Number(req.params.taskId)
  var progressId = Number(req.params.id);
  
  let achievement = req.body.achievement;
  let problem = req.body.problem;
  let next_plan = req.body.next_plan;
  let percentage = Number(req.body.percentage)
  
  let updatedProgress = await db.progress.update({
    where: {
      task_id: taskId,
      id: progressId
    },
    data: {
      achievement: achievement,
      problem: problem,
      next_plan: next_plan,
      percentage: percentage
    }
  });
  
  return res.status(200).json({
    status: 'success',
    message: 'Progress updated successfully',
    progress: updatedProgress
  });
  
});

/* Delete Progress */
router.delete('/:taskId/progress/:id', verifyToken, async (req, res, next)=> {
  var taskId = Number(req.params.taskId)
  var progressId =  Number(req.params.id)
  
  var deletedProgress = await db.progress.delete({
    where: {
    task_id : taskId,
    id: progressId
    }
  });
  
  return res.status(200).json({
    status: 'success',
    message: 'Progress deleted successfully',
    progress: deletedProgress
  });
});

module.exports = router;
