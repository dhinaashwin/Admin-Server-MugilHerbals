const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); 
const app = express();
const port = process.env.PORT || 5000;
const mongoURI = 'mongodb+srv://dhinaashwin11:MongoDBpassword@cluster-1.golhm.mongodb.net/database?retryWrites=true&w=majority&appName=Cluster-1';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  return await fn(req, res)
}
const handler = (req, res) => {
  const d = new Date()
  res.end(d.toString())
}
// Define Schemas and Models
const itemSchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  category: String,
  type: String,
  oldPrice: Number,
  newPrice: Number,
  image1: String,
  image2: String,
  image3: String,
  image4: String,
});

const accountSchema = new mongoose.Schema({
  account: String,
});

const ordersSchema = new mongoose.Schema({
  orderId: String,
  productId: Array,
  totalPrice: Number,
  payment: String,
  paymentStatus: String,
});

const Item = mongoose.model('Item', itemSchema);
const Account = mongoose.model('Account', accountSchema);
const Order = mongoose.model('Orders', ordersSchema);


app.use(cors({
  origin:['https://mugilherbals.vercel.app'],          
  methods:['POST','GET'],
  credentials:true }));

app.use(express.json());



app.get('/', (req, res) => {
  res.send('Connected');
});

// Item Routes
app.post('/api/items', async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    res.status(201).json({ message: 'Item added successfully', item: newItem });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add item', error });
  }
});

app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve items', error });
  }
});

app.get('/api/items/:id', async (req, res) => {
  try {
    const item = await Item.findOne({ id: req.params.id });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve item', error });
  }
});

app.put('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedItem = await Item.findOneAndUpdate({ id }, req.body, { new: true });
    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json({ message: 'Item updated successfully', item: updatedItem });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update item', error });
  }
});

app.delete('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Item.findOneAndDelete({ id });
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted successfully', item: deletedItem });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'Failed to delete item', error });
  }
});

// Account Routes
app.post('/api/account/check-user', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await Account.findOne({ account: email });

    if (user) {
      return res.status(200).json({ exists: true, user });
    } else {
      return res.status(404).json({ exists: false });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Orders Routes
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().lean();

    const populatedOrders = await Promise.all(
      orders.map(async (order) => {
        const items = await Item.find({ id: { $in: order.productId } });
        return { ...order, items };
      })
    );

    res.status(200).json(populatedOrders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve orders', error });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
