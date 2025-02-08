require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();

app.use(bodyParser.json());
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f6iyz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const database = client.db("myntra");
    const itemsCollection = database.collection("items");

    app.get("/items", async (req, res) => {
      try {
        const storedItems = await itemsCollection.find({}).toArray();
        res.json({ items: storedItems });
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch items" });
      }
    });

    app.get("/items/:id", async (req, res) => {
      try {
        const storedItems = await itemsCollection.find({}).toArray();
        const item = storedItems.find((item) => item.id === req.params.id);
        res.json({ item });
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch item" });
      }
    });

    app.post("/items", async (req, res) => {
      try {
        const itemData = req.body;
        const result = await itemsCollection.insertOne(itemData);
        res.json({ result });
      } catch (error) {
        res.status(500).json({ error: "Failed to add item" });
      }
    });

    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } catch (error) {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});