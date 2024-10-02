const express = require("express");
const router = express.Router();
const DefinitionsController = require("../Controllers/DefinitionsControllers");

// Corrected route methods to match Definitions terminology
router.get("/", DefinitionsController.getAllDefinitions);  // Fetch all definitions
router.post("/", DefinitionsController.addDefinition);  // Add a new definition
router.get("/:id", DefinitionsController.getById);  // Fetch a definition by ID
router.put("/:id", DefinitionsController.updateDefinition);  // Update a definition by ID
router.delete("/:id", DefinitionsController.deleteDefinition);  // Delete a definition by ID

// Export the router
module.exports = router;
