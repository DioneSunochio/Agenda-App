const Contact = require("../models/ContactModel");

exports.index = async (req, res) => {
  const contacts = await Contact.findAllContacts();
  res.render("index", { contacts });
  return;
};
