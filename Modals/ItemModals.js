const mongoose = require('mongoose');
const itemSchema = new mongoose.Schema({
  id: String,
  name: String,
  description:String,
  category: String,
  type:String,
  oldPrice: Number,
  newPrice: Number,
  image1: String,
  image2: String,
  image3: String,
  image4: String,
});
const Item = mongoose.model('Item', itemSchema);
module.exports = Item;
