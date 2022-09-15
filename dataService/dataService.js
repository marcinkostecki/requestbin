const mongo = require('./mongo.js');
const postgresService = require('./postgresService');

// eslint-disable-next-line max-lines-per-function
async function insert(request) {
  const req = {
    ip: request.ip,
    path: request.url,
    method: request.method,
    headers: request.headers,
    body: JSON.stringify(request.body),
  };

  let mongoId;
  try {
    mongoId = await mongo.insertOne(req);
    console.log(`Created request in mongo with id: ${mongoId}`);
  } catch (error) {
    // ABORT
  }

  try {
    const result = await postgresService.insertRequest(mongoId, request.params.publicId);
    // throw error;
  } catch (error) {
    console.error(error.message);
    const mongoResult = await mongo.deleteOne(mongoId);
    // // console.log(mongoResult);
    // // console.log(`Deleted request in mongo with id: ${mongoId}`);
    // const readOneResult = await mongo.readOne(mongoId);
    // console.log(readOneResult);
  }
}

async function createBin(binId, ip) {
  // call postgres service to do this for me
  const result = await postgresService.createBin(binId, ip);
  return result;
}

async function binExists(publicId) {
  return postgresService.binExists(publicId);
}

module.exports = { insert, createBin, binExists };