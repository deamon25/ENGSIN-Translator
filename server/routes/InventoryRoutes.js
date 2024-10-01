const express = require("express");
const router = express.Router();
const InventoryController = require("../Controllers/InventoryControllers");

router.get("/", InventoryController.getAllInventory);
router.post("/", InventoryController.addInventory);
router.get("/:id", InventoryController.getById);
router.put("/:id", InventoryController.updateInventory);
router.delete("/:id", InventoryController.deleteInventory);

// Export the router
module.exports = router;
