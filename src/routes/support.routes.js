const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');

router.post('/', supportController.submitInquiry);

module.exports = router;
