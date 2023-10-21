const express = require('express');
const app = express();
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json());



// mongodb atlas config



const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.xekxnzy.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const products = client.db("AllProduct").collection("product");
    const cartProducts = client.db("CartProduct").collection("AddedProduct");

    app.get("/data", async(req,res)=>{
      const result = await products.find().toArray();
      console.log(result);
      res.send(result);
    })

    app.get("/data/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await products.findOne(query);
      console.log(result);
      res.send(result);
    });

    app.post("/data",async(req,res)=>{
      const data = req.body;
      const result = await products.insertOne(data);

      console.log(result);
      res.send(result);
    })

    app.put("/data/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedUSer = {
        $set: {
          name: data.name,
          url: data.url,
          brand:data.brand,
          price:data.price,
          type: data.type
        },
      };
      const result = await products.updateOne(
        filter,
        updatedUSer,
        options
      );
      res.send(result);
      console.log(result);
    });


    // Cart backend

    app.get("/cart", async(req,res)=>{
      const result = await cartProducts.find().toArray();
      res.send(result);
      console.log(result);
    })

    app.post("/cart",async(req,res)=>{
      const data = req.body;
      const result = await cartProducts.insertOne(data);
      res.send(result);
      console.log(result);
    })

    app.delete("/cart/:id",async(req,res)=>{
      const id  =req.params.id;
      const query = {_id : new ObjectId(id)};
      const result = await cartProducts.deleteOne(query);
      console.log(result);
      res.send(result)
    })



    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('hi,world its mizan')
})

app.listen(port, () => {
  console.log(`This app is listening on port ${port}`)
})