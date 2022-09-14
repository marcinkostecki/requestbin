const express = require("express");
const userModel = require("./models");
const app = express();

app.post("/add_user", async (request, response) => {
  // datastumodule(request)
  
  console.log(request.rawHeaders)
  console.log(request.method)
  console.log(request.body)
  console.log(request.headers)
  console.log(request.ip)
  const user = new userModel(request.body);

  try {
    saved = await user.save();
    console.log(typeof saved._id)
    console.log(saved._id)
    result = await userModel.find(saved)
    console.log(result)
    response.send(user);

  } catch (error) {
    response.status(500).send(error);
  }

  // user.find(saved)

  //Add to SQL
});


app.get("/users", async (request, response) => {
  const users = await userModel.find({});

  try {
    response.send(users);
  } catch (error) {
    response.status(500).send(error);
  }
});

module.exports = app;