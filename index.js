const express = require('express');
const cors = require('cors');
const connectDB = require('./Config/db');
const itemRoutes = require('./Routes/ItemRoutes');
const accountRoutes = require('./Routes/AccountRoutes');
const ordersRoutes = require('./Routes/OrdersRoutes');
require('dotenv').config();
const app = express();

// Connect to MongoDB
connectDB();

// Use CORS middleware with all origins allowed
app.use(cors({
  origin: '*', // Allow all origins
}));

app.use(express.json());

// Routes
app.use('/api/items', itemRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/orders',ordersRoutes)

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
