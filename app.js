const express = require("express");
const dataService = require("./dataService/dataService");
const { v4: uuidv4 } = require('uuid');
const app = express();
port = 3000;

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded());

//Got to hompage showing bins and New bin button
app.get("/", (request, response) => {
  // send home page
  // explanation of what this does
  // option to create a bin
  // show bins
});

//Show all the bins
app.get("/bins", async (request, response) => {
  // const ip = request.headers['x-forwarded-for'];
  const ip = request.ip;
  const bins = await dataService.getBinsFromIp(ip);
  console.log("show all bins: ip", ip)
  console.log("show all bins: bins", bins)
  response.status(200).json(bins);
});

//Put request in the bin
app.all("/req/:publicId", async (request, response) => {
  console.log(`${request.method} request received`);
  // if the bin does not exist, send back a 404, else continue
  const binExists = await dataService.binExists(request.params.publicId);
  if (!binExists) {
    response.status(400).json({ error: "bin does not exist" });
  } else {
    await dataService.insert(request);
    response.send('thanks');
  }
});

// Show request from a bin
app.get("/bin/:binId", async (request, response) => {
  const binId = request.params.binId

  try {
    const reqs = await dataService.getRequestsFromBin(binId)
    response.status(200).json(reqs);
  } catch (err) {
    console.log("In binID", err.message);
    response.status(400).json({ error: err.message });
  }
});

//Creating a bin
app.post("/bin", async (request, response) => {
  const binId = uuidv4();
  // const ip = request.headers['x-forwarded-for'];
  const ip = request.ip
  const result = await dataService.createBin(binId, ip);


  //needs fixing
  response.redirect(`/bin/${binId}`);
});

app.listen(port, () => console.log('Running express app'));