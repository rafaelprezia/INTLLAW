// routes/legalCaseRoutes.js
const express = require("express");
const legalCaseController = require("../api/media/textController");

const router = new express.Router();

router.post("/legal-cases", legalCaseController.createLegalCase);
router.get("/legal-cases/:id", legalCaseController.getLegalCaseById);
router.patch("/legal-cases/:id", legalCaseController.updateLegalCase);
router.delete("/legal-cases/:id", legalCaseController.deleteLegalCase);
router.get("/legal-cases", legalCaseController.getAllLegalCases);

module.exports = router;
