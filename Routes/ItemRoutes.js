const express = require('express');
const Item = require('../Modals/ItemModals');

const router = express.Router();

// POST endpoint to add a new item
router.post('/', async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    res.status(201).json({ message: 'Item added successfully', item: newItem });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add item', error });
  }
});

// GET endpoint to retrieve all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve items', error });
  }
});

// GET endpoint to retrieve a single item by ID
router.get('/:id', async (req, res) => {
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

// PUT endpoint to update an item
router.put('/:id', async (req, res) => {
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

// DELETE endpoint to remove an item
router.delete('/:id', async (req, res) => {
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

module.exports = router;
