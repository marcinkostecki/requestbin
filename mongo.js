// need to install mongo
// just need to save and return id for pg to keep

const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/test');

  const requestSchema = new mongoose.Schema({
    name: String
  });

  const Request = mongoose.model('Request', requestSchema);

  const myRequest = new Request({ name: 'myRequest' });
  console.log(myRequest.name);

  const result = await myRequest.save();
  console.log(result);
}






