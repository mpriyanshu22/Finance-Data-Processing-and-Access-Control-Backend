const User = require('../models/User');

const getUsers = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) {
      filter.status = status;
    }


    const users = await User.find(filter).select('-password');
    res.json(users);
  } catch (err) {
    next(err);
  }
};

const approveUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = 'active';
    await user.save();

    res.json({
      message: "User approved successfully",
      user: { id: user._id, username: user.username, status: user.status }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getUsers, approveUser };
