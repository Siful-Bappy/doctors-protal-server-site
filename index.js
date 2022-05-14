const express = require('express')
const cors = require("cors");
require("dotenv").config();
const app = express()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion } = require('mongodb');

// middle ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.notzb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
async function run() {
    try {
      await client.connect(); 
      const database = client.db("sample_mflix").collection("");
    }
    finally{

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello to doctors protal')
})

app.listen(port, () => {
  console.log(`My port is: ${port}`)
})