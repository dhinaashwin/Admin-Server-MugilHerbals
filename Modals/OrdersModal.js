const mongoose = require('mongoose');
const ordersSchema = new mongoose.Schema({
  orderId:String,
  productId:Array,
  totalPrice:Number,
  payment:String,
  paymentStatus:String
});
const Order = mongoose.model('Orders', ordersSchema);
module.exports = Order;