const Definition = require("../models/DefinitionsModel"); // Correct model import

// Get all definitions
const getAllDefinitions = async (req, res, next) => {
  let inven;
  try {
    inven = await Definition.find(); // Correct model name
  } catch (err) {
    console.log(err);
  }
  if (!inven) {
    return res.status(404).json({ message: "Definition not found" });
  }
  return res.status(200).json({ inven });
};

// Add a new definition
const addDefinition = async (req, res) => {
  try {
    const { date, word, definition, username } = req.body;

    const newDefinition = new Definition({
      date,
      word,
      definition,
      username,
    });

    const savedDefinition = await newDefinition.save(); // Correct variable name
    res.status(201).json(savedDefinition);
  } catch (error) {
    res.status(500).json({ message: "Failed to add Definition", error });
  }
};

// Get definition by ID
const getById = async (req, res, next) => {
  const id = req.params.id;

  let inven;
  try {
    inven = await Definition.findById(id); // Correct model name
  } catch (err) {
    console.log(err);
  }
  if (!inven) {
    return res.status(404).json({ message: "Definition Not Found" });
  }
  return res.status(200).json({ inven });
};

// Update definition
const updateDefinition = async (req, res, next) => {
  const id = req.params.id;
  
  console.log("Received data from frontend:", req.body); // Log the request body

  const { word, definition, username, date, rating } = req.body;

  try {
    const updatedDefinition = await Definition.findByIdAndUpdate(
      id,
      {
        word: word,
        definition: definition,
        username: username,
        date: date,
        rating: rating,  // Ensure rating is included
      },
      { new: true } // Return the updated document
    );

    if (!updatedDefinition) {
      return res.status(404).json({ message: "Unable to Update Definition" });
    }

    return res.status(200).json({ updatedDefinition });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Delete definition
const deleteDefinition = async (req, res, next) => {
  const id = req.params.id;

  let inven;
  try {
    inven = await Definition.findByIdAndDelete(id); // Correct model name
  } catch (err) {
    console.log(err);
  }
  if (!inven) {
    return res.status(404).json({ message: "Unable to Delete Definition" });
  }
  return res.status(200).json({ inven });
};

exports.getAllDefinitions = getAllDefinitions;
exports.addDefinition = addDefinition;
exports.getById = getById;
exports.updateDefinition = updateDefinition;
exports.deleteDefinition = deleteDefinition;
