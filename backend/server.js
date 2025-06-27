require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => {
  console.log('MongoDB connected');
  
  // Bind to 0.0.0.0 for CI compatibility
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });

  // Handle shutdown gracefully
  process.on('SIGTERM', () => {
    server.close(() => {
      console.log('Process terminated');
      mongoose.connection.close(false, () => {
        process.exit(0);
      });
    });
  });
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});
