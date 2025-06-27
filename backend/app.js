const express = require('express');
const cors = require('cors');
const moodRoutes = require('./routes/moods');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/moods', moodRoutes);

// Start server binding to 0.0.0.0
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});


module.exports = app;
