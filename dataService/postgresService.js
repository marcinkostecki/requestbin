const pg = require('pg');

var connectionString = "postgres://marcin:@localhost/request_bin";
var pgClient = new pg.Client(connectionString);
pgClient.connect();

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

module.exports = { insertRequest, createBin, binExists };
