var express = require('express');
var { PrismaClient } = require('@prisma/client');
const verifyToken = require('../middlewares/verifyToken');
const { decodeBase64 } = require('bcryptjs');

const router = express.Router();
const db = new PrismaClient();

/* List progress */
// router.get('/:taskId/progress', verifyToken, async (req, res, next) => {
//     let taskId = req.params.taskId;

//     let progresses = await db.progress.findMany({
//         where: {
//             task_id : taskId
//         }
//     });

//     let task = await db.task.findUnique({
//         where: {
//             id: taskId
//         }
//     });

//     task.progresses = progresses;

//     return res.json({
//         status: 'success',
//         message: 'Data retrieved successfully',
//         task : task
//     });
// });

/* Add progress */
router.post('/:taskId/progress', verifyToken, async (req, res, next) => {
    let taskId = req.params.taskId;
    let userId = req.user.id;
    
    let achievement = req.body.achievement;
    let problem = req.body.problem;
    let next_plan = req.body.next_plan;
    let percentage = req.body.percentage;

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

    let progressId = req.params.id;
    let taskId = req.params.taskId;

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
router.put('/:taskId/progress/:id', verifyToken, (req, res, next) => {

});

/* Delete Progress */
router.delete('/:taskId/progress/:id', verifyToken, (req, res, next)=> {

});


module.exports = router;