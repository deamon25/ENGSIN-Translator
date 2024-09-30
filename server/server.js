const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize Express
const app = express();

// Middleware
app.use(express.json());  // To handle JSON payloads
app.use(cors());  // To allow cross-origin requests

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
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
