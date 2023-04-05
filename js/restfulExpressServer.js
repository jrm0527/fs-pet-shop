const requireAuth = false;
import express from "express";
const app = express();

import basicAuth from "express-basic-auth";

import pg from "pg";
const { Client } = pg;

import dotenv from "dotenv";
dotenv.config();

const port = 8000;
const users = process.env.DATABASE_USERS.split(", ");
const passwords = process.env.DATABASE_PASSWORDS.split(", ");
let userPass = {};
for (let i = 0; i < users.length; i++) {
  userPass[users[i]] = passwords[i];
}

if (requireAuth) {
  app.use(
    basicAuth({
      users: userPass,
      challenge: true,
      realm: "Required",
    })
  );
}

app.use(express.json());

app.get("/pets", async (req, res) => {
  const client = new Client(process.env.DATABASE_URL);
  client.connect();
  const { rows } = await client.query("SELECT * FROM pet");
  res.json(rows);
  client.end();
});

app.get("/pets/:petIndex", async (req, res, next) => {
  let index = Number(req.params.petIndex);
  const client = new Client(process.env.DATABASE_URL);
  client.connect();
  const { rows } = await client.query(`SELECT * FROM pet WHERE id = ${index}`);
  if (rows.length === 0) {
    next({ status: 404, message: "Not Found" });
  } else {
    res.json(rows);
  }
  client.end();
});

app.get("/boom", function (req, res, next) {
  next({ status: 500, message: "Internal Server Error" });
});

app.post("/pets", async function (req, res, next) {
  let petName = req.body.name;
  let petAge = Number(req.body.age);
  let petKind = req.body.kind;

  const query = {
    text: "INSERT INTO pet (name, age, kind) VALUES($1, $2, $3) RETURNING *",
    values: [petName, petAge, petKind],
  };

  const client = new Client(process.env.DATABASE_URL);
  client.connect();
  const { rows } = await client.query(query);
  if (rows.length === 0) {
    next({ status: 400, message: "Bad Request" });
  } else {
    res.json(rows);
  }
  client.end();
});

app.patch("/pets/:petIndex", async function (req, res, next) {
  let index = Number(req.params.petIndex);
  let petName = req.body.name;
  let petAge = Number(req.body.age);
  let petKind = req.body.kind;
  let query = {};
  if (!petName && !petAge && !petKind) {
    next({ status: 400, message: "Bad Request" });
  }

  if (petName) {
    query = {
      text: "UPDATE pet SET name = $1 WHERE id=$2 RETURNING *",
      values: [petName, index],
    };
  }

  if (petAge) {
    query = {
      text: "UPDATE pet SET age = $1 WHERE id=$2 RETURNING *",
      values: [petAge, index],
    };
  }

  if (petKind) {
    query = {
      text: "UPDATE pet SET kind = $1 WHERE id=$2 RETURNING *",
      values: [petKind, index],
    };
  }
  const client = new Client(process.env.DATABASE_URL);
  await client.connect();

  client.query(query, (error, result) => {
    if (error) {
      console.log("error");
      next({ status: 400, message: "Bad Request" });
      return;
    }
    res.json(result.rows);
    client.end();
  });
});

app.put("/pets/:petIndex", async function (req, res, next) {
  let index = Number(req.params.petIndex);
  let petName = req.body.name;
  let petAge = Number(req.body.age);
  let petKind = req.body.kind;

  if (!petName || !petAge || !petKind) {
    next({ status: 400, message: "Bad Request" });
  }

  const query = {
    text: "UPDATE pet SET name = $1, age = $2, kind = $3 WHERE id=$4 RETURNING *",
    values: [petName, petAge, petKind, index],
  };

  const client = new Client(process.env.DATABASE_URL);
  await client.connect();
  client.query(query, (error, result) => {
    if (error) {
      console.log("error");
      next({ status: 400, message: "Bad Request" });
      return;
    }
    res.json(result.rows);
    client.end;
  });
});

app.delete("/pets/:petIndex", async function (req, res, next) {
  let index = Number(req.params.petIndex);
  const query = {
    text: "DELETE FROM pet WHERE id = $1 RETURNING *",
    values: [index],
  };
  const client = new Client(process.env.DATABASE_URL);
  await client.connect();
  client.query(query, (error, result) => {
    console.log(error ? error.stack : result.rows);
    res.json(result.rows);
    client.end;
  });
});

app.use((req, res, next) => {
  next({ status: 404, message: "Not Found" });
});

app.use((error, req, res, next) => {
  res.status(error.status).send(error.message);
});

app.listen(port, function () {
  console.log("server is running");
});
