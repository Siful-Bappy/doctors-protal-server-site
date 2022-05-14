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
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
      await client.connect(); 
      const servicesCollection = client.db("doctors-portal").collection("services");
      
      app.get("/service", async(req, res) => {
          const query = {};
          const cursor = servicesCollection.find(query);
          const services = await cursor.toArray();
          res.send(services);
      })
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