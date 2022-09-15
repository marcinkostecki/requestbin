const express = require("express");
const dataService = require("../dataService/dataService");
const app = express();
const { v4: uuidv4 } = require('uuid');
port = 4567;

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded());

app.get("/bin/:binId", async (request, response) => {
  const binId = request.params
  console.log(request)
  try {
    // const data = dataServices.someMethod to do this call to SQL for our bin data
    response.status(200);
    // response.json(data);
  } catch (err){
    console.log(err)
    response.status(400);
    response.json({ error: err.message });
  }
});

app.post("/bin", async (request, response) => {
  const ip = request.ip
  const binId = uuidv4();
  // dataservices.createBin
  console.log(request.headers['x-forwarded-for'])

  response.redirect(`/bin/${binId}`)
})

app.listen(port, () => console.log('Running express app'));