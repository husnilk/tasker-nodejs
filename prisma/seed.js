const { PrismaClient } = require("@prisma/client");
const bcryptjs = require("bcryptjs");

const db = new PrismaClient();

async function main() {
  const spv = await db.user.create({
    data: {
      email: "spv@server.com",
      name: "Super Visor",
      password: bcryptjs.hashSync("password", 10),
      supervisor_id: null,
      avatar: null,
    },
  });
  const admin = await db.user.create({
    data: {
      email: "admin@server.com",
      name: "Admin",
      password: bcryptjs.hashSync("password", 10),
      supervisor_id: spv.id,
      avatar: null,
    },
  });
  const member01 = await db.user.create({
    data: {
      email: "member01@server.com",
      name: "Member Bobby",
      password: bcryptjs.hashSync("password", 10),
      supervisor_id: admin.id,
      avatar: null,
    },
  });
  const member02 = await db.user.create({
    data: {
      email: "member02@server.com",
      name: "Member Clara",
      password: bcryptjs.hashSync("password", 10),
      supervisor_id: admin.id,
      avatar: null,
    },
  });
  const member03 = await db.user.create({
    data: {
      email: "member03@server.com",
      name: "Member Dora",
      password: bcryptjs.hashSync("password", 10),
      supervisor_id: admin.id,
      avatar: null,
    },
  });
  const member04 = await db.user.create({
    data: {
      email: "member04@server.com",
      name: "Member Ester",
      password: bcryptjs.hashSync("password", 10),
      supervisor_id: admin.id,
      avatar: null,
    },
  });
  const member05 = await db.user.create({
    data: {
      email: "member05@server.com",
      name: "Member Fathya",
      password: bcryptjs.hashSync("password", 10),
      supervisor_id: admin.id,
      avatar: null,
    },
  });

  const task01 = await db.task.create({
    data: {
      name: "Task 01",
      desc: "Description Task 01",
      deliverable: "Deliverable Task 01",
      status: 1,
      start_date: new Date(),
      deadline: new Date(),
      supervisor_id: spv.id,
    },
  });
  const task02 = await db.task.create({
    data: {
      name: "Task 02",
      desc: "Description Task 02",
      deliverable: "Deliverable Task 02",
      status: 1,
      start_date: new Date(),
      deadline: new Date(),
      supervisor_id: spv.id,
    },
  });

  const userTask01 = await db.assignment.create({
    data: {
      user_id: member01.id,
      task_id: task01.id,
    },
  });
  const userTask02 = await db.assignment.create({
    data: {
      user_id: member01.id,
      task_id: task02.id,
    },
  });
  const userTask03 = await db.assignment.create({
    data: {
      user_id: member02.id,
      task_id: task01.id,
    },
  });

  console.log({ admin, member01, member02, member03, member04, member05 });
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
