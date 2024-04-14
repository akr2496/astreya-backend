const express = require('express');
const router = express.Router();
const { executeQuery, getList, getInfo, runQuery } = require('./../database/snowflakeDB');


router.get('/', (req, res) => {
    console.log('inside snowflake routes');
    res.json('Welcome to Snowflake route')
});

router.get('/list', async (req,res)=> {
    const {sqlQuery} = req.query;
    console.log(req.query)
    try {
        const data = await getList(sqlQuery);
        console.log( data)
        res.json(data);
    } catch(error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/info', async (req,res)=> {
    const {sqlQuery} = req.query;
    console.log(req.query)
    try {
        const data = await getInfo(sqlQuery);
        console.log( data)
        res.json(data);
    } catch(error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/run', async (req, res) => {
    const { sqlQuery } = req.body;
    
    if (!sqlQuery) {
      return res.status(400).json({ error: 'SQL query is required.' });
    }
    try {
      // const [rows] = await runQuery(sqlQuery);
      const { fields, rows } = await runQuery(sqlQuery);
      res.json( { fields: fields, rows: rows });
    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'An error occurred while executing the query.' });
    }
  });


module.exports = router;

