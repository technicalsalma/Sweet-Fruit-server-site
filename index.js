const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

//middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eyw60.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  try{
   await client.connect();
   const fruitCollection = client.db('SweetFruit').collection('fruitService');
   
  app.get('/fruitService',async(req, res) =>{
      const query = {};
      const cursor = fruitCollection.find(query);
      const fruits = await cursor.toArray();
      res.send(fruits)
  });

  app.get('/fruitService/:id',async(req, res) =>{
    const id = req.params.id;
    const query = {_id: ObjectId(id)};
    const fruitService = await fruitCollection.findOne(query);
    res.send(fruitService);
  });
  
  app.post('/fruitService/',async(req, res) =>{
    const newInventory = req.body;
    const result = await fruitCollection.insertOne(newInventory);
    res.send(result);
  })

  app.put("/fruitService/:id", async (req, res) => {
    const id = req.params.id;
    const updatedStock = req.body;
    const filter = { _id: ObjectId(id) };
    const options = { upsert: true };

    const updateDoc = {
      $set: {
        quantity: updatedStock.quantity,
      },
    };
    const result = await fruitCollection.updateOne(filter, updateDoc, options);
    res.send(result);
  });


  app.delete("/fruitService/:id", async(req, res)=>{
    const id = req.params.id;
    const query = {_id: ObjectId(id)};
    const result = await fruitCollection.deleteOne(query);
    res.send(result);
  });

  }
  finally{

  }
}
run().catch(console.dir)



app.get('/', (req , res)=>{
    res.send('json is running');
});

app.listen(port,()=>{
    console.log('john is running on port', port);
})