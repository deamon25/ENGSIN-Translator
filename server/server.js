const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const  UserRouter  = require("./routes/user");
const bodyParser = require("body-parser");
const DefinitionsRoutes = require("./routes/DefinitionsRoutes");
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
app.use("/definition", DefinitionsRoutes);



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
  inputText: { type: String, required: true },
  translatedText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Create Translation Model
const Translation = mongoose.model('Translation', translationSchema);

// Routes


// POST: Save a translation to the database
// app.post('/api/translations', async (req, res) => {
  
//   const { fromText, toText } = req.body;

//   const inputText = fromText;
//   const translatedText = toText;

//   const translation = new Translation({ inputText, translatedText });
//   await translation.save();
  
//   res.status(201).json(translation);
// });


// POST: Save a translation to the database
app.post('/api/translations', async (req, res) => {
  try {
    const { fromText, toText } = req.body;

    // Create a new translation document
    const translation = new Translation({
      inputText: fromText,
      translatedText: toText,
    });

    // Save the translation to MongoDB
    await translation.save();

    // Respond with the saved translation data
    res.status(201).json({
      success: true,
      data: translation,
    });
  } catch (error) {
    console.error('Error saving translation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save translation',
    });
  }
});


// GET: Retrieve all translations (translation history)
app.get('/api/translations', async (req, res) => {
  const translations = await Translation.find().sort({ createdAt: -1 });
  res.json(translations);
});


// DELETE: Delete a translation by ID
app.delete('/api/translations/:id', async (req, res) => {
  try {
    const { id } = req.params; // Get the ID from the URL parameters
    //console.log(`Deleting translation with ID: ${id}`); // Debug log for the ID

    // Attempt to find and delete the translation
    const deletedTranslation = await Translation.findByIdAndDelete(id);

    // Check if the translation exists
    if (!deletedTranslation) {
      return res.status(404).json({ success: false, message: 'Translation not found' });
    }

    // If successful, send a response back
    res.status(200).json({ success: true, message: 'Translation deleted successfully' });
  } catch (error) {
    console.error('Error during deletion:', error); // Log error for debugging
    res.status(500).json({ success: false, message: 'Failed to delete translation' });
  }
});



// Start the server

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});