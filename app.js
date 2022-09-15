const express = require("express");
const dataService = require("./dataService/dataService");
const { v4: uuidv4 } = require('uuid');
const app = express();
port = 3000;

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded());

app.get("/", (request, response) => {
  // send home page
  // explanation of what this does
  // option to create a bin
  // show bins
});

app.get("/bins", (request, response) => {
  const ip = request.headers['x-forwarded-for'];
  //const bins = dataServices.getBins(ip);
  response.status(200).json(bins);
});

app.all("/req/:binId", async (request, response) => {
  console.log(`${request.method} request received`);
  await dataService.insert(request);
  response.send('thanks');
});

app.get("/bin/:binId", async (request, response) => {
  const binId = request.params
  console.log(request)
  try {
    // const reqs = dataServices.getReqs
    response.status(200)/*.json(reqs)*/;
  } catch (err) {
    console.log(err);
    response.status(400).json({ error: err.message });
  }
});

app.post("/bin", async (request, response) => {
  const binId = uuidv4();
  const ip = request.headers['x-forwarded-for'];
  const result = await dataService.createBin(binId, ip);

  response.redirect(`/bin/${binId}`);
});

app.listen(port, () => console.log('Running express app'));