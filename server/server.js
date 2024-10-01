const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const  UserRouter  = require("./routes/user");
const bodyParser = require("body-parser");
const InventoryRoute = require("./routes/InventoryRoutes");
const path = require('path');
require('dotenv').config();



const PORT = process.env.PORT || 5000;
const app = express();





const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true, // Allow cookies and credentials
};

app.use(cors(corsOptions));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));


app.use(express.json());
app.use('/auth', UserRouter);
app.use('/api/users', UserRouter);
app.use("/inventory", InventoryRoute);



// Connect to MongoDB
const ATLAS_URI = 'mongodb+srv://it22601360:UFF3K2JDI0uoU8Eq@itp.adbiuzh.mongodb.net/translationHistory?retryWrites=true&w=majority';

mongoose.connect(ATLAS_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Define Translation Schema
const translationSchema = new mongoose.Schema({
  inputText: String,
  translatedText: String,
  createdAt: { type: Date, default: Date.now }
});

// Create Translation Model
const Translation = mongoose.model('Translation', translationSchema);

// Routes

// POST: Save a translation to the database
app.post('/api/translations', async (req, res) => {
  const { inputText, translatedText } = req.body;

  const translation = new Translation({ inputText, translatedText });
  await translation.save();
  
  res.status(201).json(translation);
});

// GET: Retrieve all translations (translation history)
app.get('/api/translations', async (req, res) => {
  const translations = await Translation.find().sort({ createdAt: -1 });
  res.json(translations);
});

// Start the server

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});