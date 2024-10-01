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

const addInventory = async (req, res, next) => {
  const { word, definition, username, price, date, imgurl, rating } = req.body;

  let inven;
  try {
    inven = new Inventory({
      word,
      definition,
      username,
      price,
      date,
      imgurl,
      rating: rating || 0, // Include the rating field
    });
    await inven.save();
  } catch (err) {
    console.log(err);
  }
  if (!inven) {
    return res.status(404).json({ message: "Unable to add Inventory" });
  }
  return res.status(200).json({ inven });
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
