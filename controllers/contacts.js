const { Contact } = require("../models/contact");

const { HttpError, ctrlWrapper } = require("../helpers");

const getContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10, favorite, name, phone } = req.query;
  const skip = (page - 1) * limit;

  //----фильтрация контактов по полю избранного------//
  // const filterParams = favorite ? { owner, favorite } : { owner }; /если только по favorite/

  const filterParams = { owner };
  if (favorite) {
    filterParams.favorite = favorite;
  }
  if (name) {
    filterParams.name = name;
  }
  if (phone) {
    filterParams.phone = phone;
  }

  const result = await Contact.find(filterParams, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "email subscription");

  res.status(200).json(result);
};

const getContactByID = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findOne({ _id: id, owner }).populate(
    "owner",
    "email"
  );
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
};

const addContact = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  await result.populate("owner", "email subscription");
  res.status(201).json(result);
};

const removeContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findOneAndRemove({ _id: id, owner });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json({ message: "contact deleted" });
};

const updateById = async (req, res) => {
  const { name, email, phone } = req.body;
  const { id } = req.params;
  const { _id: owner } = req.user;
  if (!name && !email && !phone) {
    res.status(400).json({ message: "missing fields" });
  }
  const result = await Contact.findOneAndUpdate({ _id: id, owner }, req.body, {
    new: true,
  }).populate("owner", "email");
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
};

const updateStatusContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findOneAndUpdate({ _id: id, owner }, req.body, {
    new: true,
  }).populate("owner", "email");
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
};

module.exports = {
  getContacts: ctrlWrapper(getContacts),
  getContactByID: ctrlWrapper(getContactByID),
  addContact: ctrlWrapper(addContact),
  removeContact: ctrlWrapper(removeContact),
  updateById: ctrlWrapper(updateById),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
