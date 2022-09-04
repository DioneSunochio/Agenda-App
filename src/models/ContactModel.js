const mongoose = require("mongoose");
const { async } = require("regenerator-runtime");
const validator = require("validator");

const ContactSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: false, default: "" },
  email: { type: String, required: false, defalut: "" },
  phone: { type: String, required: false, defalut: "" },
  createIn: { type: Date, default: Date.now },
});

const ContactModel = mongoose.model("Contact", ContactSchema);

function Contact(body) {
  this.body = body;
  this.errors = [];
  this.contact = null;
}

Contact.prototype.register = async function () {
  this.valid();
  if (this.errors.length > 0) return;
  this.contact = await ContactModel.create(this.body);
};

Contact.prototype.valid = function () {
  this.cleanUp();
  if (!this.body.firstName) this.errors.push("First Name is required!");
  if (this.body.email && !validator.isEmail(this.body.email))
    this.errors.push("Invalid Email.");
  if (!this.body.email && !this.body.phone) {
    this.errors.push(
      "At least one of the fields must be filled in: email or phone"
    );
  }
};

Contact.prototype.cleanUp = function () {
  for (let key in this.body) {
    if (typeof this.body[key] !== "string") {
      this.body[key] = "";
    }

    this.body = {
      firstName: this.body.firstName,
      lastName: this.body.lastName,
      email: this.body.email,
      phone: this.body.phone,
    };
  }
};

Contact.prototype.edit = async function (id) {
  if (typeof id !== "string") return;
  this.valid();
  if (this.errors.length > 0) return;
  this.contact = await ContactModel.findByIdAndUpdate(id, this.body, {
    new: true,
  });
};

//Static Methods.
Contact.findId = async function (id) {
  if (typeof id !== "string") return;
  const contact = await ContactModel.findById(id);
  return contact;
};

Contact.findAllContacts = async function () {
  const contacts = await ContactModel.find().sort({ createIn: -1 });
  return contacts;
};

Contact.delete = async function (id) {
  if (typeof id !== "string") return;
  const contact = await ContactModel.findOneAndDelete({ _id: id });
  return contact;
};

module.exports = Contact;
