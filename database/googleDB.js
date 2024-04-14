
const { BigQuery } = require('@google-cloud/bigquery');
const keyFilename = '/Users/ashishranjan/Desktop/Personal/InterviewPrep/astreya/backend/astreya-testing1.json'
const bigquery = new BigQuery({keyFilename});
// const bigquery = new BigQuery();

/*************************************************************************************************************
 * 
 * Database logics
 *************************************************************************************************************/

async function listDatasets() {
  try {
    // List datasets in the public project
    // const [datasets] = await bigquery.getDatasets({ projectId: 'bigquery-public-data' });
    const [datasets] = await bigquery.getDatasets({ projectId: 'astreya-testing' });
    let data = [];
    datasets.forEach(dataset => {
      const dataItem = {name : dataset.id, tables: [], lastFetchTime : null, expanded: false};
      data.push(dataItem);
    });
    return data;

  } catch (error) {
    console.error('Error listing datasets:', error);
  }
}

async function listTables(datasetId) {
  try {
    // List tables in the specified dataset
    
    const [data] = await bigquery.dataset(datasetId).getTables();
    
    let tables = [];
    data.forEach(table => {
      tables.push({name : table.id, tables: [], lastFetchTime : null, expanded: false})
    });
    return tables;
  } catch (error) {
    console.error('Error listing tables:', error);
  }
}

async function runQuery(sqlQuery) {
  try {
    // Run the SQL query
    const [result] = await bigquery.query(sqlQuery);
    console.log(result)
    return [result]
  } catch (error) {
    console.error('Error running query:', error);
  }
}

async function runQueryV2(sqlQuery) {
  console.log(sqlQuery);
  try {
    const [result] = await bigquery.query(sqlQuery);
    const fields = Object.keys(result[0]);
    return { fields: fields, rows: result };
  } catch (error) {
    console.error('Error running query:', error);
    throw error; // Rethrow the error to handle it outside this function
  }
}

module.exports = {
    listDatasets,
    listTables,
    runQuery,
    runQueryV2
}