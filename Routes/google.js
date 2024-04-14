// server.js
const express = require('express');
const { BigQuery } = require('@google-cloud/bigquery');

const router = express.Router();
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
      tables.push(table.id)
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
    const rows = result.map(row => {
      const rowData = {};
      fields.forEach(field => {
        rowData[field] = row[field];
      });
      return rowData;
    });

    // Return both schema and data
    return { fields: fields, rows: rows };
  } catch (error) {
    console.error('Error running query:', error);
    throw error; // Rethrow the error to handle it outside this function
  }
}


/*************************************************************************************************************
 * 
 * Endpoint for executing a BigQuery query
 *************************************************************************************************************/

router.get('/', async (req, res) => {
  console.log('indide google routes');
  // console.log(bigquery);
  const datasets = await listDatasets();
  console.log(datasets)
  res.send(datasets)
})


router.get('/query', async (req, res) => {
  // const query = req.query.query;
  const query = `

  `
  try {
    const [rows] = await bigquery.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'An error occurred while executing the query.' });
  }
});

router.get('/getTables/:datasetId', async (req, res) => {
  
  const datasetId = req.params.datasetId;
  console.log(`getting table for ${datasetId}`);
  const tables = await listTables(datasetId);
  console.log(tables);
  res.json(tables);
});

router.post('/run', async (req, res) => {
  const { sqlQuery } = req.body;
  
  if (!sqlQuery) {
    return res.status(400).json({ error: 'SQL query is required.' });
  }
  try {
    // const [rows] = await runQuery(sqlQuery);
    const { fields, rows } = await runQueryV2(sqlQuery);
    res.json( { fields: fields, rows: rows });
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'An error occurred while executing the query.' });
  }
});

module.exports = router;
