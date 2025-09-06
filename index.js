require("dotenv").config()

const express = require('express');
const cors = require('cors');
const compression = require('compression');
const userRoutes = require('./src/routes/routes');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 8080
const uri = process.env.MONGO;

const app = express();

app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}))

const clientOptions = {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true
  }
};
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});

app.use('/api/', userRoutes);
const connectMongoose = async () => {
  try {
    await mongoose.connect(uri, clientOptions);
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.error(err);
  }
}
connectMongoose()