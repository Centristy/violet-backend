"use strict";
/** Database setup for Violet. */
const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

// let db;

// if (process.env.NODE_ENV === "production") {
//   db = new Client({
//     connectionString: getDatabaseUri(),
//     ssl: {
//       rejectUnauthorized: false
//     }
//   });
// } else {
//   db = new Client({
//     connectionString: getDatabaseUri()
//   });
// }

// db.connect();


let DB_URI

if(process.env.NODE_ENV === "test"){
  DB_URI = "postgresql:///violet_test";
}else {
  DB_URI = "postgresql:///violet"
}

let db = new Client({
  connectionString: DB_URI
})
db.password = 'abc123'
db.connect()

module.exports = db;