const pg = require('pg');

var connectionString = "postgres://marcin:@localhost/request_bin";
var pgClient = new pg.Client(connectionString);
pgClient.connect();

async function insertRequest(mongoId, path) {
  const binId = await getBinId(path);
  const sql = `INSERT INTO requests(bin_id, mongo_id) VALUES (${binId}, '${mongoId}')`;
  const result = await pgClient.query(sql);
  return result;
}

async function getBinId(path) {
  const sql = `SELECT id FROM bins WHERE url = '${path}'`;
  const result = await pgClient.query(sql);
  return result.rows.length === 0 ? null : result.rows[0].id;
}

module.exports = { insertRequest };
