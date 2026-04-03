const Record = require('../models/Record');
const User = require('../models/User');

const createRecord = async (req, res, next) => {
  try {
    const { amount, type, category, date, notes } = req.body;
    const newRecord = new Record({
      amount, type, category, date, notes,
      createdBy: req.user.id
    });

    await newRecord.save();

    const balanceChange = type === 'income' ? amount : -amount;
    await User.findByIdAndUpdate(req.user.id, { $inc: { balance: balanceChange } });

    res.status(201).json(newRecord);
  } catch (err) {
    next(err);
  }
};

const getRecords = async (req, res, next) => {
  try {
    const { type, category, startDate, endDate, date } = req.query;
    const filter = {};

    if (type) filter.type = type;
    if (category) {
      filter.category = { $regex: new RegExp(category, 'i') }; // Case-insensitive matching
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    else if (date) {
      const searchDate = new Date(date);
      const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));
      filter.date = { $gte: startOfDay, $lte: endOfDay };
    }

    const records = await Record.find(filter).populate('createdBy', 'username role');
    res.json(records);
  } catch (err) {
    next(err);
  }
};

const getRecord = async (req, res, next) => {
  try {
    const record = await Record.findById(req.params.id).populate('createdBy', 'username role');
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.json(record);
  }
  catch (err) {
    next(err);
  }
};

const updateRecord = async (req, res, next) => {
  try {
    const originalRecord = await Record.findById(req.params.id);
    if (!originalRecord) return res.status(404).json({ message: "Record not found" });


    const oldBalanceChange = originalRecord.type === 'income' ? -originalRecord.amount : originalRecord.amount;
    await User.findByIdAndUpdate(originalRecord.createdBy, { $inc: { balance: oldBalanceChange } });


    Object.assign(originalRecord, req.body);
    await originalRecord.save();


    const newBalanceChange = originalRecord.type === 'income' ? originalRecord.amount : -originalRecord.amount;
    await User.findByIdAndUpdate(originalRecord.createdBy, { $inc: { balance: newBalanceChange } });

    res.json(originalRecord);
  } catch (err) {
    next(err);
  }
};

const deleteRecord = async (req, res, next) => {
  try {
    const record = await Record.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ message: "Record not found" });


    const oldBalanceChange = record.type === 'income' ? -record.amount : record.amount;
    await User.findByIdAndUpdate(record.createdBy, { $inc: { balance: oldBalanceChange } });

    res.json({ message: "Record deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = { createRecord, getRecords, getRecord, updateRecord, deleteRecord };
