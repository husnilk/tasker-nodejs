const express = require("express");
const { PrismaClient } = require("@prisma/client");
const verifyToken = require("../middlewares/verifyToken");
const bcrytpjs = require("bcryptjs");

const router = express.Router();
const prisma = new PrismaClient();

/* Get User Profile */
router.get("/", verifyToken, async (req, res, next) => {
  var user = req.user;

  const userDb = await prisma.user.findUnique({
    where: {
      email: user.email,
    },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      Supervisor: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return res.json({
    status: "success",
    message: "Data retrieved successfully",
    data: userDb,
  });
});

/* Updated User Profile */
router.post("/", verifyToken, async (req, res, next) => {
  var userId = req.user.id;

  console.log(req.user);

  var email = req.body.email;
  var name = req.body.name;
  var password = req.body.password;
  var avatar = req.body.avatar;

  var updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      email: email,
      name: name,
      password: bcrytpjs.hashSync(password, 10),
      avatar: avatar,
    },
  });

  return res.json({
    status: "success",
    message: "Data updated successfully",
    data: updatedUser,
  });
});

module.exports = router;
