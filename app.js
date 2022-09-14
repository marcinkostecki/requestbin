const express = require("express");
const dataService = require("./dataService/dataService");
const userModel = require("./dataService/models");
const app = express();
port = 3000;

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded());

app.all("/", async (request, response) => {
  console.log(`${request.method} request received`);
  await dataService.insert(request);
  response.send('thanks');
});

app.listen(port, () => console.log('Running express app'));