const express = require('express');
const Orders = require('../Modals/OrdersModal');
const Item = require('../Modals/ItemModals');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const orders = await Orders.find().lean();

    // Fetch item details for each order
    const populatedOrders = await Promise.all(
      orders.map(async (order) => {
        const items = await Item.find({ id: { $in: order.productId } });
        return { ...order, items };
      })
    );

    res.status(200).json(populatedOrders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve items', error });
  }
});

module.exports = router;
