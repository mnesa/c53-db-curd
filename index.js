const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;




// middleware
app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSW}@cluster0shop52.knssrag.mongodb.net/?retryWrites=true&w=majority`;

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
    const database = client.db('mn_c53_curd');
    const usersCollection = database.collection('Users');
    const ordersCollection = database.collection('Order');

    // const user = { name: 'text', email: 'text@gmail.com' }
    // const send = await usersCollection.insertOne(user);
    // console.log(send);

    // User Get
    app.get('/users', async (req, res) => {
      const query = {};
      const cursor = usersCollection.find(query);
      const users = await cursor.toArray();
      res.send(users)
    }) 

    // user add via Post
    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result)
      console.log(result);
    })




  } finally {
    // await client.close();
  }
}
run().catch(error => console.log(error));


app.get('/', (req, res) => {
  res.send('Hello CURD Operation')
})

app.listen(port, () => {
  console.log(`Our Curd Operation run on: ${port}`)
})