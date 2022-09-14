const mongo = require('./mongo.js');

async function insert(request) {
  const req = {
    ip: request.ip,
    path: request.url,
    method: request.method,
    headers: request.headers,
    body: JSON.stringify(request.body),
  };
  
  const mongoId = await mongo.insertOne(req);

  // insert into postgres
}



module.exports = { insert };