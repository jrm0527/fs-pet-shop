const fs = require("fs");
// const routes = require("./routes");
const petRegExp = /^\/pets\/(.*)$/;

const http = require("http");
const port = 8000;

const handleRequest = function (req, res) {
  //   if (req.method === "GET" && routes[req.url] !== undefined) {
  if (req.method === "GET") {
    
    if (!petRegExp.test(req.url)) {
      fs.readFile("pets.json", "utf8", function (error, data) {
        if (error) {
          console.error(error);
          return;
        }
        res.setHeader("Content-Type", "application/json");
        res.statusCode = 200;
        res.end(data);
      });
    } else {
      fs.readFile("pets.json", "utf8", function (error, data) {
        if (error) {
          console.error(error);
          return;
        }
        let pets = JSON.parse(data);
        let index = Number(req.url.match(petRegExp)[1]);
        console.log(index);
        if (
          index >= pets.length ||
          index < 0 ||
          !Number.isFinite(index) ||
          req.url === "/pets/"
        ) {
          res.setHeader("Content-Type", "text/plain");
          res.statusCode = 404;
          res.end("Not Found");
        } else {
          res.setHeader("Content-Type", "application/json");
          res.statusCode = 200;
          res.end(JSON.stringify(pets[index]));
        }
      });
    }
  } else {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      let name = JSON.parse(body).name;
      let age = Number(JSON.parse(body).age);
      let kind = JSON.parse(body).kind;

      if (!name || !age || !kind || !Number.isFinite(age)) {
        res.setHeader("Content-Type", "text/plain");
        res.statusCode = 400;
        res.end("Bad Request");
      } else {
        fs.readFile("pets.json", "utf8", function (error, data) {
          if (error) {
            console.error(error);
          } else {
            let pets = JSON.parse(data);
            pets.push({ age: age, kind: kind, name: name });
            fs.writeFile("pets.json", JSON.stringify(pets), function (error) {
              if (error) {
                console.error(error);
              } else {
                let response = {
                  name: name,
                  age: age,
                  kind: kind,
                };

                res.setHeader("Content-Type", "application/json");
                res.statusCode = 200;
                res.end(JSON.stringify(response));

                console.error("write complete");
              }
            });
          }
        });
      }
    });
  }

  // console.log(petRegExp.test(req.url));
  // let index = req.url.match(petRegExp);
  // console.log(index[1]);
  // fs.readFile("pets.json", "utf8", function (error, data) {
  //   if (error) {
  //     console.error(error);
  //     return;
  //   }
  //   let pets = JSON.parse(data);
  //   let pet = JSON.stringify(pets[1]);
  //   res.setHeader("Content-Type", "application/json");
  //   res.statusCode = 200;
  //   res.end(pet);

  // routes[req.url](req, res);
};
// const server = http.createServer(function (req, res) {});
const server = http.createServer(handleRequest);

server.listen(port, function () {
  console.log("listening on port", port);
});
