const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const app = express();

const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vin9bep.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    // Send a ping to confirm a successful connection
    const coffeeCallection = client.db('coffeeDB').collection('coffee')

    app.get('/coffee', async (req, res) => {
      const cursor = coffeeCallection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    app.get('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await coffeeCallection.findOne(query);
      res.send(result);
    })

    app.post('/coffee', async (req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee)
      const result = await coffeeCallection.insertOne(newCoffee)
      res.send(result);
    })

    app.put('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = {upsert: true};
      const coffeeUpdate = req.body;
      const coffee = {
        $set: {
          name: coffeeUpdate.name,
          chef: coffeeUpdate.chef,
          supplier: coffeeUpdate.supplier,
          taste: coffeeUpdate.taste,
          category: coffeeUpdate.category,
          details: coffeeUpdate.details,
          photo: coffeeUpdate.photo
        }
      }
      const result = await coffeeCallection.updateOne(filter ,coffee , options);
      res.send(result)

    })

    app.delete('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await coffeeCallection.deleteOne(query);
      res.send(result);
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send("Coffie Server is Running")
})

app.listen(port, () => {
  console.log(`Coffie Server Running on port: ${port}`);
})
