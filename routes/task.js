var express = require("express");
var { PrismaClient } = require("@prisma/client");
const verifyToken = require("../middlewares/verifyToken");

var prisma = new PrismaClient();
var router = express.Router();

/* List Our task */
router.get("/", verifyToken, async (req, res, next) => {
  let userId = req.user.id;

  let tasks = await prisma.task.findMany({
    where: {
      supervisor_id: userId,
    },
  });

  return res.json({
    status: "success",
    message: "Data retrieved successfully",
    data: tasks,
  });
});

/* Create new Task */
// router.post("/create", verifyToken, async (req, res, next) => {
//   var name = req.body.name;
//   var desc = req.body.desc;
//   var deliverable = req.body.deliverable;
//   var start_date = new Date(req.body.start_date).toISOString();
//   var deadline = new Date(req.body.deadline).toISOString();

//   const createdTask = await prisma.task.create({
//     data: {
//       name: name,
//       desc: desc,
//       deliverable: deliverable,
//       status: 1,
//       start_date: start_date,
//       deadline: deadline,
//       supervisor_id: req.user.supervisor_id,
//       percentage: 0,
//     },
//   });

//   return res.json({
//     status: "success",
//     message: "Data created successfully",
//     data: createdTask,
//   });
// });

/* Show task detail */
router.get("/:id", verifyToken, async (req, res, next) => {
  var taskId = Number(req.params.id);

  const task = await prisma.task.findUnique({
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

/* Update Task Detail */
// router.put("/:id", verifyToken, async (req, res, next) => {
//   var taskId = req.params.id;

//   var name = req.body.name;
//   var desc = req.body.desc;
//   var deliverable = req.body.deliverable;
//   var start_date = req.body.start_date;
//   var deadline = req.body.deadline;

//   const updatedTask = await prisma.task.update({
//     where: {
//       id: taskId,
//     },
//     data: {
//       name: name,
//       desc: desc,
//       deliverable: deliverable,
//       status: 1,
//       start_date: start_date,
//       deadline: deadline,
//       supervisor_id: req.user.id,
//     },
//   });

//   return res.json({
//     status: "success",
//     message: "Data updated successfully",
//     data: updatedTask,
//   });
// });

/* Delete Task */
// router.delete("/:id", verifyToken, async (req, res, next) => {
//   var taskId = req.params.id;

//   const deletedTask = await prisma.task.delete({
//     where: {
//       id: taskId,
//     },
//   });

//   return res.json({
//     status: "success",
//     message: "Data deleted successfully",
//     data: deletedTask,
//   });
// });

module.exports = router;
