const mongoose = require('mongoose');
const db = require('./index');

const schema = new mongoose.Schema({
  id: String,
  firstName: String,
  lastName: String,
  userName: String,
  email: String,
  password: String,
});

const Users = mongoose.model('Users', schema);

module.exports = Users;
