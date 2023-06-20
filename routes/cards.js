const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', createCard);

router.put('/:cardId/likes', likeCard);

router.delete('/:cardId', deleteCardById);

router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
