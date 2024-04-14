// server.js
const express = require('express');
const router = express.Router();
const {listDatasets, listTables, runQueryV2} = require('./../database/googleDB')

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
