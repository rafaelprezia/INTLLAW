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

exports.getLegalCaseBasicSearch = async (req, res) => {
  try {
    const { query } = req.query;
    
    const queries = query.split(" ");

    const regexQueries = queries.map(query => new RegExp(query, 'i'));

    const Documents = await LegalCase.find({
      $or: [
          { title: { $all: regexQueries } },
          { partiesInvolved: { $all: regexQueries } },
          { category: { $all: regexQueries } },
          { content: { $all: regexQueries } },
          { tags: { $all: regexQueries } }
      ]
  })
   
    res.status(200).json(Documents);

  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getLegalCaseAdvancedSearch = async (req, res) => {
  try {
    const { title, date, parties, category, tags } = req.query;

    let searchFilters = {};

    if (title) {
      const titleQueries = title.split(" ").map(t => new RegExp(t, 'i'));
      searchFilters.title = { $all: titleQueries };
    }

    if (date) {
      searchFilters.date = date;
    }

    if (parties) {
      const partiesQueries = parties.split(" ").map(p => new RegExp(p, 'i'));
      searchFilters.partiesInvolved = { $all: partiesQueries };
    }

    if (category) {
      const categoryQueries = category.split(" ").map(c => new RegExp(c, 'i'));
      searchFilters.category = { $all: categoryQueries };
    }

    if (tags) {
      const tagsQueries = tags.split(",").map(t => new RegExp(t, 'i'));
      searchFilters.tags = { $all: tagsQueries };
    }

    const Documents = await LegalCase.find(searchFilters);

    res.status(200).json(Documents);

  } catch (error) {
    res.status(500).send(error);
  }
};

// Update a legal case
exports.updateLegalCase = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedLegalCase = await LegalCase.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!updatedLegalCase) {
      return res.status(404).send({ message: "Legal case not found" });
    }

    res.send(updatedLegalCase);
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
