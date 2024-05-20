"use strict";

/** Shared config for application; can be required many places. */

require("dotenv").config();
require("colors");

const SECRET_KEY = process.env.SECRET_KEY || "abc123";
const PORT = +process.env.PORT || 10000;

// Use dev database, testing database, or via env var, production database
function getDatabaseUri() {
  return (process.env.NODE_ENV === "test")
      ? "postgresql:///violet_test"
      : process.env.DATABASE_URL || "postgres://efxzihqt:o0MFwGJUfCzuMNfAXduywztKL1YNTaf5@kala.db.elephantsql.com/efxzihqt";
}

// Speed up bcrypt during tests, since the algorithm safety isn't being tested
//
// WJB: Evaluate in 2021 if this should be increased to 13 for non-test use
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

console.log("Violet Config:".green);
console.log("SECRET_KEY:".yellow, SECRET_KEY);

console.log("BCRYPT_WORK_FACTOR".yellow, BCRYPT_WORK_FACTOR);
console.log("Database:".yellow, getDatabaseUri());
console.log("---");

module.exports = {
  SECRET_KEY,
  BCRYPT_WORK_FACTOR,
  PORT,
  getDatabaseUri,
};