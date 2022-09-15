const pg = require('pg');
require('dotenv').config()

//init pgClient in the global scope
var pgClient = null

main().catch(err => console.log("postgres connection failed!\n", err));
async function main() {
  const user = process.env.POSTGRES_USER
  const pw = process.env.POSTGRES_PW
  const host = process.env.POSTGRES_HOST
  const db = process.env.POSTGRES_DB
  const connectionString = `postgres://${user}:${pw}@${host}/${db}`;
  pgClient = new pg.Client(connectionString);
  await pgClient.connect();
}

async function insertRequest(mongoId, publicId) {
  const privateId = await getPrivateId(publicId);
  const sql = `INSERT INTO requests(bin_id, mongo_id) VALUES (${privateId}, '${mongoId}')`;
  const result = await pgClient.query(sql);
  return result;
}

async function getPrivateId(publicId) {
  const sql = `SELECT id FROM bins WHERE publicId = '${publicId}'`;
  const result = await pgClient.query(sql);
  return result.rows.length === 0 ? null : result.rows[0].id;
}

async function createBin(binId, ip) {
  const sql = `INSERT INTO bins(publicId, ip_address) VALUES ('${binId}', '${ip}')`;
  const result = await pgClient.query(sql);
  return result;
}

async function binExists(publicId) {
  const privateId = await getPrivateId(publicId);
  return !!privateId;
}

//returns an array of format [ {publicId: '22rewfewq'}, {publicId: '234fewf'}, ...]
async function getBinArrayFromIp(ip) {
  try {
  const sql = `SELECT publicId FROM bins WHERE ip_address = '${ip}'`
  const result = await pgClient.query(sql)
  console.log("result", result)
  let binArray = result.rows
  //flatten bin array: [ {publicId: '123'}, {publicId: '321'}] => ['123', '321']
  binArray = binArray.map((binObj) => {
    return binObj.publicid;
  })
  console.log("binArray:", binArray)
  return binArray
  } catch(err){
    console.log("Straigt to getBinArrayFromIP postgres: ", err.message)
    return []
  }
}

//given bin ID, return an array of mongo document ids for requests
//requests are sorted such that the most recent requests are first
async function getRequestIdsFromBin(publicBinId) {
  let result;
  try{
    const privateID = await getPrivateId(publicBinId)
    const sql = `SELECT mongo_id FROM requests WHERE bin_id = '${privateID}' ORDER BY time_created DESC`
    console.log(sql)
    result = await pgClient.query(sql)
  } catch (err) {

    return [];
  }

  const requestArr = result.rows

  //flatten request array
  return requestArr.map((reqObj) => {
    return reqObj.mongo_id
  })
}

module.exports = { insertRequest, createBin, binExists, getBinArrayFromIp, getRequestIdsFromBin };
