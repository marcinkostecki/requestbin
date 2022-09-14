const mongo = require('./mongo.js');
const postgresService = require('./postgresService');

async function insert(request) {
  const path = request.url;

  const req = {
    ip: request.ip,
    path,
    method: request.method,
    headers: request.headers,
    body: JSON.stringify(request.body),
  };

  const mongoId = await mongo.insertOne(req);
  try {
    const result = await postgresService.insertRequest(mongoId, path);
    console.log(result);
  } catch (error) {
    console.error(error);
  }

}


module.exports = { insert };