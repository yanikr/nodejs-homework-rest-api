const contacts = require("../models/contacts.js");

const getAllContacts = async (req, res, next) => {
  const contactsList = await contacts.listContacts();
  res.status(200).json(contactsList);
};

const updateSingleContact = async (req, res, next) => {
  const { contactId } = req.params;
  const body = req.body;
  const contact = await contacts.updateContact(contactId, body);
  if (!body) {
    return next(res.status(404).json({ message: "not found" }));
  }
  return res.status(200).json(contact);
};

const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await contacts.getContactById(contactId);
  if (!contact) {
    return res.status(404).json({ message: "not found" });
  }
  await contacts.removeContact(contactId);
  return res.status(200).json({ message: "contact deleted" });
};

const createContact = async (req, res, next) => {
  const body = req.body;
  const newContact = await contacts.addContact(body);
  return res.status(201).json(newContact);
};

const getSingleContactById = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await contacts.getContactById(contactId);
  if (!contact) {
    return next(res.status(404).json({ message: "Not found" }));
  }
  return res.json(contact);
};

module.exports = {
  getAllContacts,
  getSingleContactById,
  createContact,
  deleteContact,
  updateSingleContact,
};
