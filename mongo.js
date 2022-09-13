// need to install mongo
// just need to save and return id for pg to keep

const express = require("express");
const mongoose = require('mongoose');
const Router = require("./routes")

const app = express()
app.use(express.json())

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/test');
}

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

// const requestSchema = new mongoose.Schema({
//   name: String
// });

// const Request = mongoose.model('Request', requestSchema);

// const myRequest = new Request({ name: 'myRequest' });
// console.log(myRequest.name);

// myRequest.save().then(result => console.log(result));

app.use(Router);

app.listen(3000, () => {
  console.log("Server is running at port 3000");
})