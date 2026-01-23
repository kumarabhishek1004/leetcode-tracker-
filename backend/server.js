const cors = require('cors');


require('dotenv').config();//Load .env variablescd..
const express = require('express');
const app = express();


require('dotenv').config();
const connectdb = require('./config/db');

app.use(express.json());//This enables us to parse JSON data in request bodies
app.use(cors());

connectdb();

const problemRoutes = require('./routes/problemRoutes');
app.use('/api/problems', problemRoutes);

app.get('/',(req,res) =>{ 
    res.send('Backend is runing ')});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
