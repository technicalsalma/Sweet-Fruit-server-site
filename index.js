const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require("mongodb");
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
      const fruits = await cursor.limit(6).toArray();
      res.send(fruits)
  })

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