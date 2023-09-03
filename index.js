const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;




// middleware
app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSW}@cluster0shop52.knssrag.mongodb.net/?retryWrites=true&w=majority`;



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

    

    // User Get
    app.get('/users', async (req, res) => {
      const query = {};
      const cursor = usersCollection.find(query);
      const users = await cursor.toArray();
      res.send(users)
    }) 


    // specific user get
    app.get('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const user = await usersCollection.findOne(query);
      res.send(user)
    })

    // user add via Post
    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result)
      // console.log(result);
    })

    // user Update
    app.put('/users/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };

      const user = req.body;
      const options = { upsert: true };
      const updateUser = {
        $set: {
          name:user.name,
          address:user.address,
          phone:user.phone,
          email:user.email
        }
      }
      const result = await usersCollection.updateOne(filter, updateUser, options);
      res.send(result)
    })

    // delete user
    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await usersCollection.deleteOne(query)
      res.send(result)
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