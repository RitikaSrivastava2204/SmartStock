const express = require('express');
const router = express.Router();
const StockItem = require('../models/StockItem');
const Alert = require('../models/Alert');
const User = require('../models/User');
const sendAlertEmail = require('../utils/mailer');

// ✅ Route 1: Check and save new alerts + send email to all users
router.get('/check-alerts', async (req, res) => {
    console.log("📢 /check-alerts endpoint triggered");
  try {
    const items = await StockItem.find(); // No need to populate userId
    const users = await User.find({}, 'email'); // Get all user emails
    const now = new Date();

    for (const item of items) {
      const addedDate = new Date(item.dateOfEntry);
      const ageInDays = Math.floor((now - addedDate) / (1000 * 60 * 60 * 24));

      if (ageInDays > item.thresholdAge) {
        const existingAlert = await Alert.findOne({
          itemId: item._id,
          alertType: 'threshold_age_cross'
        });

        if (!existingAlert) {
          await Alert.create({
            itemId: item._id,
            alertType: 'threshold_age_cross'
          });

          console.log(`✅ Alert created for ${item.itemName}`);

          // ✅ Send alert email to all users
          for (const user of users) {
            console.log(`📨 Sending email to ${user.email}`);

            if (user.email) {

              await sendAlertEmail(
                
                {
                
                to: user.email,
                itemName: item.itemName,
                batchNumber: item.batchNumber,
                thresholdAge: item.thresholdAge
              });
            }
          }
        }
      }
    }

    res.status(200).json({ message: 'Alerts checked and emails sent to all users.' });
  } catch (error) {
    console.error('❌ Error checking alerts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ✅ Route 2: Get all saved alerts (for frontend notifications)
router.get('/', async (req, res) => {
  try {
    const alerts = await Alert.find().populate('itemId');
    res.status(200).json(alerts);
  } catch (error) {
    console.error('❌ Error fetching alerts:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

router.get('/test-email', async (req, res) => {
    try {
      await sendAlertEmail({
        to: 'mksrivast@gmail.com', // 🔁 Replace with your actual Gmail
        itemName: 'Test Item',
        batchNumber: 'TEST123',
        thresholdAge: 10
      });
  
      console.log("✅ Test email triggered");
      res.send("✅ Test email sent.");
    } catch (err) {
      console.error("❌ Test email failed:", err);
      res.status(500).send("❌ Email sending failed.");
    }
  });
  

module.exports = router;
