const express = require("express");
const app = express();
const fs = require("fs");

const port = 8000;

app.get("/pets", function (req, res) {
  if (req.url === "/pets/") {
    res.status(404).send("Not Found");
    return;
  }
  fs.readFile("pets.json", "utf8", function (error, data) {
    if (error) {
      console.error(error);
      return;
    }
    res.status(200).send(data);
  });
});

app.get("/pets/:petIndex", function (req, res) {
  let index = Number(req.params.petIndex);
  fs.readFile("pets.json", "utf8", function (error, data) {
    if (error) {
      console.error(error);
      return;
    }
    let pets = JSON.parse(data);
    if (index >= pets.length || index < 0 || !Number.isFinite(index)) {
      res.status(404).send("Not Found");
    } else {
      res.status(200).send(pets[index]);
    }
  });
});

app.listen(port, function () {
  console.log("server is running");
});
