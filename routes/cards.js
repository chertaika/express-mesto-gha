const router = require('express').Router();
const { getCards, createCard, deleteCardById } = require('../controllers/cards');

router.get('/', getCards);

router.post('/', createCard);

router.put('/:cardId/likes');

router.delete('/:cardId', deleteCardById);

router.delete('/:cardId/likes');

module.exports = router;
