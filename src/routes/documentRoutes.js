// routes/legalCaseRoutes.js
const express = require("express");
const legalCaseController = require("../api/media/textController");
const superUserMiddleware = require("../middleware/superUserMiddleware");
const router = new express.Router();

router.get(
  "/legal-cases",
  //superUserMiddleware.authenticateSuperUserJWT,
  //superUserMiddleware.authorizeSuperUser,
  legalCaseController.getAllLegalCases
);
router.get(
  "/legal-cases/basicSearch",
  //superUserMiddleware.authenticateSuperUserJWT,
  //superUserMiddleware.authorizeSuperUser,
  legalCaseController.getLegalCaseBasicSearch
);
router.get(
  "/legal-cases/advancedSearch",
  //superUserMiddleware.authenticateSuperUserJWT,
  //superUserMiddleware.authorizeSuperUser,
  legalCaseController.getLegalCaseAdvancedSearch
);
router.get(
  "/legal-cases/:id",
  //superUserMiddleware.authenticateSuperUserJWT,
  //superUserMiddleware.authorizeSuperUser,
  legalCaseController.getLegalCaseById
);
router.post(
  "/legal-cases",
  //   superUserMiddleware.authenticateSuperUserJWT,
  //   superUserMiddleware.authorizeSuperUser,
  legalCaseController.createLegalCase
);
router.patch(
  "/legal-cases/:id",
  //superUserMiddleware.authenticateSuperUserJWT,
  //superUserMiddleware.authorizeSuperUser,
  legalCaseController.updateLegalCase
);
router.delete(
  "/legal-cases/:id",
  //superUserMiddleware.authenticateSuperUserJWT,
  //superUserMiddleware.authorizeSuperUser,
  legalCaseController.deleteLegalCase
);

module.exports = router;
