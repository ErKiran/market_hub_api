const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const passport = require('passport')
const app = express();
const auth = require('./routes/auth');

process.setMaxListeners(0);
mongoose.set('useCreateIndex', true);

mongoose
    .connect(process.env.MLAB, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

require('./utils/passportHelper')(passport)
app.use(passport.initialize());
app.use(passport.session())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/auth', auth)

const port = process.env.PORT || 5000;

app.listen(port);

module.exports = app;