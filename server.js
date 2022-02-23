const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

// Environment Variables
const dbUser = process.env.USER;
const dbPassword = process.env.PASS;
const uri = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.j6ced.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("zignaly");
    const phonesCollection = database.collection("phones");

    // POST PHONES
    app.post("/phones", async (req, res) => {
      const newPlan = req.body;
      const result = await phonesCollection.insertOne(newPlan);
      res.json(result);
    });

    //  GET API FROM PHONES
    app.get("/phones", async (req, res) => {
      const cursor = phonesCollection.find({});
      const products = await cursor.toArray();
    //   console.log(products);
      res.json(products);
    });

    // GET API FROM PHONES BY ID
    app.get("/phones/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await phonesCollection.findOne(query);
        res.json(result);
      });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Zignaly Project");
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});