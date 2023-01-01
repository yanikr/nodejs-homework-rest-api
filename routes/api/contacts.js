const express = require("express");
const {
  getAllContacts,
  getSingleContactById,
  createContact,
  deleteContact,
  updateSingleContact,
} = require("../../controllers/contactsController");
const { validateBody } = require("../../middlewares");
const addContactSchema = require("../../schemas/contacts");

const router = express.Router();

router.get("/", getAllContacts);

router.get("/:contactId", getSingleContactById);

router.post("/", validateBody(addContactSchema), createContact);

router.delete("/:contactId", deleteContact);

router.put("/:contactId", validateBody(addContactSchema), updateSingleContact);

module.exports = router;
