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


app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; " +
    "script-src 'self'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data:; " +
    "font-src 'self'; " +
    "connect-src 'self' https://your-api-domain.com; " +
    "object-src 'none'; " +
    "base-uri 'self'; " +
    "frame-ancestors 'self'; " +
    "form-action 'self';"
  );
  res.setHeader("X-Content-Type-Options", "nosniff");    
  res.setHeader("X-Frame-Options", "DENY");            
  res.setHeader("Referrer-Policy", "no-referrer");     
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=()"); 
  next();
});
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use('/api/', userRoutes);

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


const connectMongoose = async () => {
  try {
    await mongoose.connect(uri, clientOptions);
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.error(err);
  }
}
connectMongoose()