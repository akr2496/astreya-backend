// server.js
const express = require('express');
const { BigQuery } = require('@google-cloud/bigquery');

const router = express.Router();
const keyFilename = '/Users/ashishranjan/Desktop/Personal/InterviewPrep/astreya/backend/astreya-testing.json'
const bigquery = new BigQuery({keyFilename});


async function listDatasets() {
  try {
    // List datasets in the public project
    const [datasets] = await bigquery.getDatasets({ projectId: 'bigquery-public-data' });
    let data = [];
    datasets.forEach(dataset => {
      const dataItem = {name : dataset.id, expanded: false};
      data.push(dataItem);
    });
    return data;

  } catch (error) {
    console.error('Error listing datasets:', error);
  }
}
// Endpoint for executing a BigQuery query
router.get('/', async (req, res) => {
  console.log('indide google routes');
  // console.log(bigquery);
  const datasets = await listDatasets();
  console.log(datasets)
  res.send(datasets)
})


router.get('/google/query', async (req, res) => {
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

module.exports = router;
