const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken')
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

//middleware
// app.use(cors());
const corsOptions = {
  origin: "https://sweet-fruit-house.web.app",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
// https://sweet-fruit-house.web.app
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eyw60.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  try{
    await client.connect();
    const fruitCollection = client.db("SweetFruit").collection("fruitService");
 

    
   //Fruit Api
    app.get("/fruitService", async (req, res) => {
      const query = {};
      const cursor = fruitCollection.find(query);
      const fruits = await cursor.toArray();
      res.send(fruits);
    });

    app.get("/fruitService/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const fruitService = await fruitCollection.findOne(query);
      res.send(fruitService);
    });

    app.post("/fruitService", async (req, res) => {
      const newInventory = req.body;
  
      const result = await fruitCollection.insertOne(newInventory);
      res.send(result);
    });

    app.post("/login", async (req, res) => {
      const user = req.body;
      const accessToken =await jwt.sign(user, process.env.ACCESS_TOTKEN_SECRE, {
        expiresIn: "1d",
      });
      res.send({ accessToken });
    });

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
      const result = await fruitCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    //Delete
    app.delete("/fruitService/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await fruitCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/fruitServices/myProduct", async (req, res) => {
      const tokenInfo = req.headers.authorization;
      const [email, accessToken] = tokenInfo.split(" ");
      const decoded = verifyToken(accessToken);
      
      if (email === decoded.email) {
        const product = await fruitCollection.find({ email: email }).toArray();
        res.send(product);
      } else {
        res.send({ success: "UnAuthoraized Access" });
      }


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

// verify token function =======>>>
function verifyToken(token) {
  let email;
  jwt.verify(token, process.env.ACCESS_TOTKEN_SECRE, function (err, decoded) {
    if (err) {
      email = "Invalid email";
    }
    if (decoded) {
      email = decoded;
    }
  });
  return email;
}