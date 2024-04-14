const snowflake = require('snowflake-sdk');
const crypto = require('crypto');
const fs = require('fs');
const { promisify } = require('util');
const { exec } = require('child_process');

const privateKeyFile = fs.readFileSync('/Users/ashishranjan/Desktop/Personal/InterviewPrep/astreya/backend/rsa_key.p8');

const privateKeyObject = crypto.createPrivateKey({
  key: privateKeyFile,
  format: 'pem',
  passphrase: 'Howdy'
});

var privateKey = privateKeyObject.export({
  format: 'pem',
  type: 'pkcs8'
});

const connectionConfig = {
    account: 'enpvoiq-ez72950',
    username: 'SNOW345IK',
    password: 'ball@2894BG',
    authenticator: "SNOWFLAKE_JWT",
    privateKey: privateKey
};

const connectionPool = snowflake.createPool(connectionConfig, { max : 10, min : 0});

const executeQuery = async (sqlText) => {
    return new Promise((resolve, reject) => {
    connectionPool.use(async (clientConnection) =>
        {
            const statement = await clientConnection.execute({
                sqlText: sqlText,
                complete: function (err, stmt, rows)
                {
                    if(err){
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                }
            });
        });
    });
}

const getList = async(sqlQuery) =>  {
//   console.log('Here 1')
  try {
    const rows = await executeQuery(sqlQuery);
    console.log(rows)
    const listData = rows.map((row, index) => {return {id: index, name : row.name, tables: [], lastFetchTime : null, expanded: false}});
    // console.log('Here 2', databases)
    return listData;
  } catch (error) {
    console.error('Error getting list of databases:', error);
    throw error;
  }
}

const getInfo = async(sqlQuery) =>  {
    //   console.log('Here 1')
    try {
    const warehouseInfo = await executeQuery(sqlQuery.split('#')[0]);
    const roleInfo = await executeQuery(sqlQuery.split('#')[1]);
    console.log(warehouseInfo, roleInfo)
    const infoData = {
        warehouseInfo : warehouseInfo.map((row, index) => {return {id: index, name : row.name, size : row.size}}),
        roleInfo : roleInfo.map((row, index) => {return {name : row.name, id : index }}),
    };
    // console.log('Here 2', databases)
    return infoData;
    } catch (error) {
    console.error('Error getting list of databases:', error);
    throw error;
    }
};

async function runQuery(sqlQuery) {
    console.log(sqlQuery);
    try {
      const rows = await executeQuery(sqlQuery);
      console.log(rows)
      const fields = Object.keys(rows[0]);
      return { fields: fields, rows: rows };
    } catch (error) {
      console.error('Error running query:', error);
      throw error; // Rethrow the error to handle it outside this function
    }
};


module.exports = { executeQuery, getList, getInfo, runQuery };
