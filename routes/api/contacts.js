const express = require("express");
const contacts = require("../../models/contacts");
const addContactSchema = require("../../schemas/contacts");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const contactsList = await contacts.listContacts();
  res.status(200).json(contactsList);
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await contacts.getContactById(contactId);
  if (!contact) {
    return next(res.status(404).json({ message: "Not found" }));
  }
  return res.json(contact);
});

router.post("/", async (req, res, next) => {
  const body = req.body;
  const { error } = addContactSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "missing fields" });
  } else {
    const newContact = await contacts.addContact(body);
    return res.status(201).json(newContact);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await contacts.getContactById(contactId);
  if (contact) {
    await contacts.removeContact(contactId);
    return next(res.status(200).json({ message: "contact deleted" }));
  }
  return res.status(404).json({ message: "not found" });
});

router.put("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const body = req.body;
  const { error } = addContactSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "missing fields" });
  }
  const contact = await contacts.updateContact(contactId, body);
  if (!body) {
    return next(res.status(404).json({ message: "not found" }));
  }
  return res.status(200).json(contact);
});

module.exports = router;
