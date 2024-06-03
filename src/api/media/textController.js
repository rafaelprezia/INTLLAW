// controllers/legalCaseController.js
const LegalCase = require("../../models/document.js");

// Create a new legal case
exports.createLegalCase = async (req, res) => {
  try {
    const legalCase = new LegalCase(req.body);
    await legalCase.save();
    res.status(201).send(legalCase);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getAllLegalCases = async (req, res) => {
  try {
    const filters = {};

    if (req.query.query) {
      const query = req.query.query;
      filters.$or = [
        { title: new RegExp(query, "i") },
        { partiesInvolved: new RegExp(query, "i") },
        { category: new RegExp(query, "i") },
        { content: new RegExp(query, "i") },
        { tags: { $in: [new RegExp(query, "i")] } },
      ];
    } else {
      if (req.query.title) {
        filters.title = new RegExp(req.query.title, "i"); // Case-insensitive regex search
      }
      if (req.query.date) {
        filters.date = new Date(req.query.date);
      }
      if (req.query.partiesInvolved) {
        filters.partiesInvolved = new RegExp(req.query.partiesInvolved, "i");
      }
      if (req.query.category) {
        filters.category = req.query.category;
      }
      if (req.query.tags) {
        filters.tags = { $in: req.query.tags.split(",") };
      }
    }

    const legalCases = await LegalCase.find(filters);
    res.send(legalCases);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get a legal case by ID
exports.getLegalCaseById = async (req, res) => {
  try {
    const legalCase = await LegalCase.findById(req.params.id);
    if (!legalCase) {
      return res.status(404).send();
    }
    res.send(legalCase);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update a legal case
exports.updateLegalCase = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["title", "date", "partiesInvolved", "sectionOne"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const legalCase = await LegalCase.findById(req.params.id);
    if (!legalCase) {
      return res.status(404).send();
    }

    updates.forEach((update) => (legalCase[update] = req.body[update]));
    await legalCase.save();
    res.send(legalCase);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a legal case
exports.deleteLegalCase = async (req, res) => {
  try {
    const legalCase = await LegalCase.findByIdAndDelete(req.params.id);
    if (!legalCase) {
      return res.status(404).send();
    }
    res.send(legalCase);
  } catch (error) {
    res.status(500).send(error);
  }
};
