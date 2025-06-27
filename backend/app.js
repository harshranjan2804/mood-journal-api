const express = require('express');
const cors = require('cors');
const moodRoutes = require('./routes/moods');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/moods', moodRoutes);



module.exports = app;
