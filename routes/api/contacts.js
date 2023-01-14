const express = require("express");
const {
  getAllContacts,
  getSingleContactById,
  createContact,
  deleteContact,
  updateSingleContact,
  updateStatusContact,
} = require("../../controllers/contactsController");

const router = express.Router();

router.get("/", getAllContacts);

router.get("/:contactId", getSingleContactById);

router.post("/", createContact);

router.delete("/:contactId", deleteContact);

router.put("/:contactId", updateSingleContact);
router.patch("/:contactId/favorite", updateStatusContact);

module.exports = router;
