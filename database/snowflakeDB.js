const snowflake = require('snowflake-sdk');
const crypto = require('crypto');
const fs = require('fs');
const { promisify } = require('util');

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
    const rows = await executeQueryP(sqlQuery);
    const databases = rows.map(row => row.name);
    // console.log('Here 2', databases)
    return databases
  } catch (error) {
    console.error('Error getting list of databases:', error);
    throw error;
  }
}

module.exports = { executeQuery, getList };
