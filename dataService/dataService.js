const mongo = require('./mongo.js');
const pg = require('pg')

var connectionString = "postgres://lambag:@localhost/ip:5432/request_bin";
var pgClient = new pg.Client(connectionString)
pgClient.connect()
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
  var query = pgClient.query("SELECT * from bins")
  query.on("row", function(row, result) {
    result.addRow(row)
  })
  query.on("end", function(result) {
    console.log("postgres result", result)
  })
}



module.exports = { insert };