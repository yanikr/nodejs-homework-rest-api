const { Contact } = require("../models/contacts");

const getAllContacts = async (req, res, next) => {
  const contactsList = await Contact.find({});
  res.status(200).json(contactsList);
};

const updateSingleContact = async (req, res, next) => {
  const { contactId } = req.params;
  const body = req.body;
  const contact = await Contact.findByIdAndUpdate(contactId, body, {
    new: true,
  });
  if (!body) {
    return next(res.status(404).json({ message: "not found" }));
  }
  return res.status(200).json(contact);
};

const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await Contact.findById(contactId);
  if (!contact) {
    return res.status(404).json({ message: "not found" });
  }
  await Contact.findByIdAndRemove(contactId);
  return res.status(200).json({ message: "contact deleted" });
};

const createContact = async (req, res, next) => {
  const body = req.body;
  const newContact = await Contact.create(body);
  return res.status(201).json(newContact);
};

const getSingleContactById = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await Contact.findById(contactId);
  if (!contact) {
    return next(res.status(404).json({ message: "Not found" }));
  }
  return res.json(contact);
};

const updateStatusContact = async (req, res, next) => {
  const { contactId } = req.params;
  const body = req.body;
  const contact = await Contact.findByIdAndUpdate(contactId, body, {
    new: true,
  });
  if (!Object.prototype.hasOwnProperty.call(body, "favorite")) {
    return next(res.status(400).json({ message: "missing field favorite" }));
  }
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
  updateStatusContact,
};
