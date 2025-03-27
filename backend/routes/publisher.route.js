const express = require('express');
const router = express.Router();
const publisherController = require('../controllers/publisher.controller');

router.get('/', publisherController.getAllPublisher);

module.exports = router;