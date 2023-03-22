let fs = require("fs");
let option = process.argv[2];
let index;
let age;
let kind;
let name;

switch (option) {
  case "read":
    index = process.argv[3];
    fs.readFile("pets.json", "utf8", function (error, data) {
      let pets = JSON.parse(data);
      if (error) {
        console.error(error);
      } else if (index < pets.length) {
        console.error("Usage: node pets.js read INDEX");
        process.exit(1);
      } else if (index) {
        console.log(pets[index]);
      } else {
        console.log(pets);
      }
    });
    break;
  case "create":
    age = Number(process.argv[3]);
    kind = process.argv[4];
    name = process.argv[5];
    if (!name) {
      console.error("Usage: node pets.js create AGE KIND NAME");
      return;
    }
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
            console.error("write complete");
          }
        });
      }
    });
    break;
  case "update":
    index = process.argv[3];
    if (!index) {
      console.error("Usage: node pets.js udpate INDEX AGE KIND NAME");
      return;
    }
    fs.readFile("pets.json", "utf8", function (error, data) {
      if (error) {
        console.error(error);
      } else {
        let pets = JSON.parse(data);
        pets[index].age = age;
        pets[index].kind = kind;
        pets[index].name = name;
        fs.writeFile("pets.json", JSON.stringify(pets), function (error) {
          if (error) {
            console.error(error);
          } else {
            console.error("update complete");
          }
        });
      }
    });
    break;
  case "destroy":
    index = process.argv[3];
    if (!index) {
      console.error("Usage: node pets.js udpate INDEX");
      return;
    }
    fs.readFile("pets.json", "utf8", function (error, data) {
      if (error) {
        console.error(error);
      } else {
        let pets = JSON.parse(data);
        pets.splice(index, 1);
        fs.writeFile("pets.json", JSON.stringify(pets), function (error) {
          if (error) {
            console.error(error);
          } else {
            console.error("destroy complete");
          }
        });
      }
    });
    break;
  default:
    console.error("select an option [read | create | update | destroy]");
    process.exit(1);
}
