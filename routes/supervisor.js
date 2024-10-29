const express = require("express");
const { PrismaClient } = require("@prisma/client");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();
const prisma = new PrismaClient();

/* Get Supervisor Information Detail */
router.get("/", verifyToken, async (req, res, next) => {
  let userid = req.user.id;

  const user = await prisma.user.findUnique({
    where: {
      id: userid,
    },
  });

  if (user.supervisor_id == null) {
    return res.status(404).json({
      status: "failed",
      message: "User does not have supervisor",
    });
  }

  const supervisor = await prisma.user.findUnique({
    where: {
      id: user.supervisor_id,
    },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
    },
  });

  return res.json({
    status: "success",
    message: "Data retrieved successfully",
    supervisor: supervisor,
  });
});

module.exports = router;
