const Record = require('../models/Record');
const User = require('../models/User');

const getSummary = async (req, res, next) => {
  try {
    const summary = await Record.aggregate([
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] }
          },
          totalExpenses: {
            $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalIncome: 1,
          totalExpenses: 1,

          netBalance: { $subtract: ["$totalIncome", "$totalExpenses"] }
        }
      }
    ]);

    const categoryTotals = await Record.aggregate([
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          total: 1
        }
      }
    ]);

    const recentActivity = await Record.find()
      .sort({ date: -1 })
      .limit(5)
      .populate('createdBy', 'username role');


    const defaultSummary = { totalIncome: 0, totalExpenses: 0, netBalance: 0 };

    res.json({
      summary: summary[0] || defaultSummary,
      categoryTotals,
      recentActivity
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSummary };
