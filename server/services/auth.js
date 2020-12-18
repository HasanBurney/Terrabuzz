const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mysql = require('../db/mysql/connection.js');
const redis = require('../db/redis/connection.js');
require('dotenv').config();

const verifyUserCredentials = async ({ email: __email, password: __password }) => {
  // Checking if the user exists within the database
  let __query = `SELECT Password FROM TERRABUZZ.UserInformation WHERE Email='${__email}'`;
  let result;
  try {
    [result] = await mysql.connection.query(__query);

    // If no such email, throw an error
    if ([result[0]][0] === undefined) throw new Error('No such email exists.');
  } catch (error) {
    return ({ status: false, handle: undefined });
  }

  // Extract the DB obtained password
  const passwordFromDatabase = result[0].Password;

  let compare;

  // Compare both with bcrypt
  try {
    compare = await bcrypt.compare(__password, passwordFromDatabase);
  } catch (error) {
    return ({ status: false, handle: undefined });
  }

  // If compare returns true, ie, both are the same
  if (compare) {
    // Query handle
    __query = `SELECT Handle FROM TERRABUZZ.UserInformation WHERE Email='${__email}'`;
    try {
      // Get handle
      [result] = await mysql.connection.query(__query);
    } catch (error) {
      console.log('MySQL querying for userHandle failed in auth');
      return ({ status: false, handle: undefined });
    }

    // Store handle
    const handle = result[0].Handle;

    // If user not in cache, then insert in cache
    if (!redis.get(handle)) {
      redis.set(handle, __email);
    }

    // Return true
    return ({ status: true, handle });
  }

  // The passwords are not the same
  return new Error('Invalid credentials');
};

const generateAccessToken = (__data) => {
  const { status, handle } = verifyUserCredentials(__data);
  if (status) {
    const token = jwt.sign({ handle }, `${process.env.JWT_SECRET}`, { expiresIn: '3d' });
    console.log(token);
    return token;
  }
  throw new Error('Please login with valid credentials!');
};

module.exports.generateAccessToken = generateAccessToken;
module.exports.verifyUserCredentials = verifyUserCredentials;

const verifyAccessToken = (__token) => {
  try {
    const decodedPayload = jwt.verify(__token, `${process.env.JWT_SECRET}`);
    console.log(decodedPayload);
    return decodedPayload;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports.verifyAccessToken = verifyAccessToken;
