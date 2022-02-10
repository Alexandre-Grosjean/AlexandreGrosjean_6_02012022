const express = require('express');
const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
const path = require('path');

const helmet = require('helmet');
const rateLimit = require("express-rate-limit");
require('dotenv').config();


const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');


// connexion mongodb
mongoose.connect( process.env.mongoAtlas,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();
app.use(express.json());
app.use(helmet(
  {crossOriginResourcePolicy: false,}
  ));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// liaison server
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, Content-Type, Access-Control-Allow-Headers");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});


// app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);



module.exports = app;