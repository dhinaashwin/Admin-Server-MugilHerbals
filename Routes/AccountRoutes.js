const express = require('express');
const Account = require('../Modals/AccountModal');

const router = express.Router();

// POST endpoint to check if user exists
router.post('/check-user', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await Account.findOne({ account: email }); // Matching email with account field in MongoDB

    if (user) {
      return res.status(200).json({ exists: true, user });
    } else {
      return res.status(404).json({ exists: false });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
