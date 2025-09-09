require("dotenv").config()

const express = require('express');
const cors = require('cors');
const compression = require('compression');
const userRoutes = require('./src/routes/routes');
const connectDBMiddleware = require('./src/middleware/db-middleware');

const PORT = process.env.PORT || 8080
const uri = process.env.MONGO;

const app = express();

app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use('/api/', connectDBMiddleware, userRoutes);

if (process.env.NODE_ENV !== 'production') {
  console.log("running");
  
  const PORT = process.env.PORT || 8080;
  const connectMongoose = require('./mongodb.js');

  app.listen(PORT, async () => {
    try {
      await connectMongoose();
      console.log("Server is running on port " + PORT);
      console.log("Connected to MongoDB!");
    } catch (err) {
      console.error("Failed to connect to MongoDB:", err);
    }
  });
}

module.exports = app