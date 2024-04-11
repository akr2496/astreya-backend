const express = require('express') ;
const googleRoutes = require('./Routes/google');
const snowflakeRoutes = require('./Routes/snowflake');
const cors = require('cors');

const app = express();
const port = 8080;

app.use(cors());
app.get('/', (req, res) => {
    console.log('Hi');
    res.json('Welcome to Backend')
});
app.use('/google', googleRoutes);
app.use('/snowflake', snowflakeRoutes);

app.listen(port, () => {
    console.log(`connected to port : ${port}`)
});