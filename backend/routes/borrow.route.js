const express = require('express');
const router = express.Router();
const borrowController = require('../controllers/borrow.controller');

router.get('/', borrowController.getAllBorrow);
router.post('/', borrowController.borrowRequest);
router.put('/:id', borrowController.approveBorrow);
router.delete('/:id', borrowController.rejectBorrow);
router.put('/return/:id', borrowController.returnBook);

module.exports = router;
