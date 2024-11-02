const express = require("express");
const { PrismaClient } = require("@prisma/client");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();
const prisma = new PrismaClient();

/* Get list of subordinates */
router.get("/", verifyToken, async (req, res, next) => {
  //get userId;
  var userId = req.user.id;

  var members = await prisma.user.findMany({
    where: {
      supervisor_id: userId,
    },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      _count: {
        select: {
          Task: true,
        },
      },
    },
  });

  return res.json({
    status: "success",
    message: "Data retrieved successfully",
    data: members,
  });
});

/* Get detail information of subordinate */
router.get("/:id", verifyToken, (req, res, next) => {
  var memberId = req.params.id;
  var userId = req.user.id;

  prisma.user
    .findUnique({
      where: {
        id: Number(memberId),
        supervisor_id: Number(userId),
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        UserTask: {
          select: {
            id: true,
            name: true,
            desc: true,
            deliverable: true,
            status: true,
            start_date: true,
            deadline: true,
          },
        },
      },
    })
    .then((member) => {
      return res.json({
        status: "success",
        message: "Data retrieved successfully",
        data: member,
      });
    });
});

module.exports = router;
