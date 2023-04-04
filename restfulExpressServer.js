const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");
const port = 8000;

app.use(express.json());
app.use(bodyParser.json());

app.get("/pets", function (req, res) {
  fs.readFile("pets.json", "utf8", function (error, pets) {
    if (error) {
      console.error(error);
      return;
    }
    res.json(JSON.parse(pets));
  });
});

app.get("/pets/:petIndex", function (req, res, next) {
  let index = Number(req.params.petIndex);
  fs.readFile("pets.json", "utf8", function (error, data) {
    if (error) {
      console.error(error);
      return;
    }
    let pets = JSON.parse(data);
    if (pets[index]) {
      res.json(pets[index]);
    } else {
      next({ status: 404, message: "Not Found" });
    }
  });
});

app.get("/boom", function (req, res, next) {
  next({ status: 500, message: "Internal Server Error" });
});

app.post("/pets", function (req, res, next) {
  let name = req.body.name;
  let age = Number(req.body.age);
  let kind = req.body.kind;

  if (!name || !age || !kind || !Number.isFinite(age)) {
    next({ status: 404, message: "Bad Request" });
  } else {
    fs.readFile("pets.json", "utf8", function (error, data) {
      if (error) {
        res.error(error);
      } else {
        let newPet = {
          name: name,
          age: age,
          kind: kind,
        };
        let pets = JSON.parse(data);
        pets.push(newPet);
        fs.writeFile("pets.json", JSON.stringify(pets), function (error) {
          if (error) {
            res.error(error);
          } else {
            res.json(newPet);
          }
        });
      }
    });
  }
});

app.patch("/pets/:petIndex", function (req, res, next) {
  let index = Number(req.params.petIndex);
  fs.readFile("pets.json", "utf8", function (error, data) {
    if (error) {
      console.error(error);
      return;
    }
    let pets = JSON.parse(data);
    let pet = pets[index];
    if (!pet) {
      next({ status: 404, message: "Bad Request" });
      return;
    }
    let name = req.body.name;
    let age = Number(req.body.age);
    let kind = req.body.kind;

    if (name) {
      pet.name = name;
    }
    if (age) {
      pet.age = age;
    }
    if (kind) {
      pet.kind = kind;
    }
    fs.writeFile("pets.json", JSON.stringify(pets), function (error) {
      if (error) {
        res.error(error);
      } else {
        res.json(pet);
      }
    });
  });
});

app.delete("/pets/:petIndex", function (req, res, next) {
  let index = Number(req.params.petIndex);
  fs.readFile("pets.json", "utf8", function (error, data) {
    if (error) {
      console.error(error);
      return;
    }
    let pets = JSON.parse(data);
    if (!pets[index]) {
      next({ status: 404, message: "Bad Request" });
      return;
    }
    let pet = pets.splice(index);
    fs.writeFile("pets.json", JSON.stringify(pets), function (error) {
      if (error) {
        res.error(error);
      } else {
        res.json(pet);
      }
    });
  });
});

app.listen(port, function () {
  console.log("server is running");
});
