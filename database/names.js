const mongoose = require('mongoose');
const db = require('./index');

const schema = new mongoose.Schema({
  id: Number,
  name: String,
});

const Names = mongoose.model('Names', schema);

module.exports = Names;
