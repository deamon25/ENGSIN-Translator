const Inventory = require("../models/InventoryModel");

const getAllInventory = async (req, res, next) => {
  let inven;
  try {
    inven = await Inventory.find();
  } catch (err) {
    console.log(err);
  }
  if (!inven) {
    return res.status(404).json({ message: "Inventory not found" });
  }
  return res.status(200).json({ inven });
};

const addInventory = async (req, res) => {
  try {
    const { date, word, definition, username } = req.body;

   

    const newInventory = new Inventory({
      date,
      word,
      definition,
      username,
    });

    const savedInventory = await newInventory.save();
    res.status(201).json(savedInventory);
  } catch (error) {
    res.status(500).json({ message: "Failed to add inventory", error });
  }
};


const getById = async (req, res, next) => {
  const id = req.params.id;

  let inven;
  try {
    inven = await Inventory.findById(id);
  } catch (err) {
    console.log(err);
  }
  if (!inven) {
    return res.status(404).json({ message: "Inventory Not Found" });
  }
  return res.status(200).json({ inven });
};

const updateInventory = async (req, res, next) => {
  const id = req.params.id;
  
  console.log("Received data from frontend:", req.body); // Log the request body to see what is sent

  const { word, definition, username, date, rating } = req.body;

  try {
    const updatedInventory = await Inventory.findByIdAndUpdate(
      id,
      {
        word: word,
        definition: definition,
        username: username,
        date: date,
        rating: rating,  // Ensure rating is included in the update
      },
      { new: true } // Return the updated document
    );

    if (!updatedInventory) {
      return res.status(404).json({ message: "Unable to Update Inventory" });
    }

    return res.status(200).json({ updatedInventory });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};



const deleteInventory = async (req, res, next) => {
  const id = req.params.id;

  let inven;
  try {
    inven = await Inventory.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }
  if (!inven) {
    return res.status(404).json({ message: "Unable to Delete Inventory Details" });
  }
  return res.status(200).json({ inven });
};

exports.getAllInventory = getAllInventory;
exports.addInventory = addInventory;
exports.getById = getById;
exports.updateInventory = updateInventory;
exports.deleteInventory = deleteInventory;
