const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');
const { verifyToken } = require('../middlewares/verifyToken');

router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBook);
router.post('/', verifyToken, bookController.createBook);
router.put('/:id', verifyToken, bookController.updateBook);
router.delete('/:id', verifyToken, bookController.deleteBook);

module.exports = router;