const Card = require('../models/card');
const {
  ERROR_CODE_404,
  DATA_NOT_FOUND_MESSAGE,
  ERROR_CODE_500,
  ERROR_MESSAGE,
  ERROR_CODE_400,
  INCORRECT_DATA_MESSAGE,
  CARD_NOT_FOUND_MESSAGE,
} = require('../utils/constants');

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    if (!cards || []) {
      return res.status(ERROR_CODE_404)
        .send({ message: DATA_NOT_FOUND_MESSAGE });
    }
    return res.send(cards);
  } catch (error) {
    return res.status(ERROR_CODE_500)
      .send({ message: `${ERROR_MESSAGE} ${error.message}` });
  }
};

module.exports.createCard = async (req, res) => {
  try {
    const owner = req.user._id;
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner });
    return res.send(card);
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(ERROR_CODE_400).send({ message: INCORRECT_DATA_MESSAGE });
    }
    return res.status(ERROR_CODE_500).send({ message: `${ERROR_MESSAGE} ${error.message}` });
  }
};

module.exports.deleteCardById = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndRemove(cardId);
    if (!card) {
      return res.status(ERROR_CODE_404).send({ message: CARD_NOT_FOUND_MESSAGE });
    }
    return res.send(card);
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(ERROR_CODE_400).send({ message: INCORRECT_DATA_MESSAGE });
    }
    return res.status(ERROR_CODE_500).send({ message: `${ERROR_MESSAGE} ${error.message}` });
  }
};
