const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const passport = require('passport')
const app = express();


process.setMaxListeners(0);
mongoose.set('useCreateIndex', true);

mongoose
    .connect(process.env.MLAB, { useNewUrlParser: true, useFindAndModify: false })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.use(passport.initialize());
app.use(passport.session())

const port = process.env.PORT || 5000;

app.listen(port);

module.exports = app;