

require('dotenv').config();//Load .env variablescd..
const express = require('express');
const app = express();
const cors = require('cors');

require('dotenv').config();
const connectdb = require('./config/db');

app.use(express.json());//This enables us to parse JSON data in request bodies

connectdb();

const problemRoutes = require('./routes/problemRoutes');
app.use('/api/problems', problemRoutes);

app.get('/',(req,res) =>{ 
    res.send('Backend is runing ')});

app.listen(5000,() =>{
    console.log('Server Started');
});