const mongo = require('./mongo.js');
const postgresService = require('./postgresService');

// eslint-disable-next-line max-lines-per-function
async function insert(request) {
  const req = {
    // ip: request.headers['x-forwarded-for'], // use this for nginx
    ip: request.ip, // use this locally
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
    await postgresService.insertRequest(mongoId, request.params.publicId);
    return req;
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

//returns an array of public bin IDs given an IP address
async function getBinsFromIp(ip) {
  let result
  try {
    result = await postgresService.getBinArrayFromIp(ip)
  } catch (err) {
    console.log("get bins from IP failed\n", err)
  }

  return result
}

//returns an array of requests given a bin ID
async function getRequestsFromBin(publicBinId) {
  //get an array of document IDs from postgres

  const mongoIdArr = await postgresService.getRequestIdsFromBin(publicBinId)
  if (mongoIdArr.length === 0) {
    return []
  }

  //use the array of document IDs to pull requests from mongo
  const requestArr = await mongo.readMany(mongoIdArr)
  return requestArr
}

//returns the sitched together object {bin: info, request: [requests]}
async function getBinInfoAndRequests(binID) {
  const requests = await getRequestsFromBin(binID);
  const binInfo = await postgresService.getBinInfo(binID);
  return { binInfo, requests }
}


module.exports = { insert, createBin, binExists, getBinsFromIp, getRequestsFromBin, getBinInfoAndRequests };
