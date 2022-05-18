const express = require('express')
const cors = require("cors");
require("dotenv").config();
const app = express()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion } = require('mongodb');
const { send } = require('express/lib/response');

// middle ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.notzb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
      await client.connect(); 
      const servicesCollection = client.db("doctors-portal").collection("services");
      const bookingCollection = client.db("doctors-portal").collection("bookings");

      app.get("/service", async(req, res) => {
          const query = {};
          const cursor = servicesCollection.find(query);
          const services = await cursor.toArray();
          res.send(services);
      })

      app.get("/booking", async(req, res) => {
        const patient = req.query.patient;
        const query = {patient: patient};
        const bookings = await bookingCollection.find().toArray();
        res.send(bookings);
      })

      app.post("/booking", async(req, res) => {
        const booking = req.body;
        const query = {treatment: booking.treatment, date: booking.date, patient: booking.patient}
        const exists = await bookingCollection.findOne(query)
        if(exists) {
          return res.send({success: false, booking: exists})
        }
        const result = await bookingCollection.insertOne(booking);
        res.send({success: true, result});
      })


      // app.get('/available', async(req, res) =>{
      //   const date = req.query.date;
  
      //   // step 1:  get all services
      //   const services = await servicesCollection.find().toArray();
  
      //   // step 2: get the booking of that day. output: [{}, {}, {}, {}, {}, {}]
      //   const query = {date: date};
      //   const bookings = await bookingCollection.find(query).toArray();
  
      //   // step 3: for each service
      //   services.forEach(service=>{
      //     // step 4: find bookings for that service. output: [{}, {}, {}, {}]
      //     const serviceBookings = bookings.filter(book => book.treatment === service.name);
      //     // step 5: select slots for the service Bookings: ['', '', '', '']
      //     const bookedSlots = serviceBookings.map(book => book.slot);
      //     // step 6: select those slots that are not in bookedSlots
      //     const available = service.slots.filter(slot => !bookedSlots.includes(slot));
      //     //step 7: set available to slots to make it easier 
      //     service.slots = available;
      //   });



      // waring this is not the proper way to query multiple collection
      // After learning more about mongodb. use aggregate, lookup, pipeline, match, groupn
      app.get("/available ", async(req, res) => {
        const date = req.query.date || "may 12 2022";
        // step  1 get all services
        const services = await servicesCollection.find().toArray();
  
        // step 2: get the booking of that day. output: [{}, {}, {}, {}, {}, {}]
        const query = {date: date};
        const bookings = await bookingCollection.find(query).toArray();
  
        // step 3: for each service
        services.forEach(service=>{
          // step 4: find bookings for that service. output: [{}, {}, {}, {}]
          const serviceBookings = bookings.filter(book => book.treatment === service.name);
          // step 5: select slots for the service Bookings: ['', '', '', '']
          const bookedSlots = serviceBookings.map(book => book.slot);
          // step 6: select those slots that are not in bookedSlots
          const available = service.slots.filter(slot => !bookedSlots.includes(slot));
          //step 7: set available to slots to make it easier 
          service.slots = available;
          
        })
        

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











      
      /* 
        API naming convention 
        1. app.get("/booking")   // get all bookings in this collection. or more than one or filter
        2. app.get("/booking/:id")  // get a specific booking
        3. app.post("/booking")  // add a new booking
        4. app.patch("booking/:id")  // update a new booking
        5. app.delete("/booking/:id")  // delete a booking
      */

