const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staff.controller');
const { verifyToken } = require('../middlewares/verifyToken');
const { verifyManager } = require('../middlewares/auth');

router.get('/', verifyToken, staffController.getAllStaff);
router.get('/:id', staffController.getStaff);
router.post('/', verifyToken, verifyManager, staffController.createStaff);
router.put('/:id', verifyToken, verifyManager, staffController.updateStaff);
router.delete('/:id', verifyToken, verifyManager, staffController.deleteStaff);
router.post('/login', staffController.loginStaff);

module.exports = router;