const express = require('express');
const router = express.Router();
const { executeQuery, getList } = require('./../database/snowflakeDB');


router.get('/', (req, res) => {
    console.log('inside snowflake routes');
    res.json('Welcome to Snowflake route')
});

router.get('/list', async (req,res)=> {
    const {sqlQuery} = req.body;
    try {
        const data = await getList(sqlQuery);
        console.log( data)
        res.json(data);
    } catch(error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/run', async (req, res) => {
  const { sqlQuery } = req.body;

  try {
    const rows = await executeQuery(sqlQuery);
    res.json({ rows });
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;

