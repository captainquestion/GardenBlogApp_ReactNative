const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const gardenRoutes = require('./routes/garden');

const app = express();

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Routes setup
app.use('/api/auth', authRoutes);
app.use('/api/garden', gardenRoutes);

// Connect to MongoDB
const MONGO_URI = 'mongodb+srv://canberkyilmaz439:UVHJrurxfIjP1H4i@cluster0.ajugq3j.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err));

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
