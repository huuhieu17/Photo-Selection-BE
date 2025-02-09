const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user !== null) {
      return res.status(400).json({ message: 'Tài khoản đã tồn tại' });
    }
    const userData = new User({ email, password, name });
    await userData.save();
    res.status(200).json({ message: 'Đăng ký thành công, vui lòng đăng nhập' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Thông tin đăng nhập không chính xác' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Thông tin đăng nhập không chính xác' });
    }
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ accessToken });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const _id = req.user.userId
    const user = await User.findOne({ _id });
    if(user) {
      const {email, name, _id} = user
      res.json({ email, name, _id });
    }
  } catch (e) {
    res.json({ ...req.user });
  }
}

module.exports = { register, login, getCurrentUser };