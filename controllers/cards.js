const Card = require('../models/card');
const {
  ERROR_CODE_404,
  DATA_NOT_FOUND_MESSAGE,
  ERROR_CODE_500,
  ERROR_MESSAGE,
  ERROR_CODE_400,
  CARD_NOT_FOUND_MESSAGE,
  SUCCESSFUL_DELETE,
  INCORRECT_ADD_CARD_DATA_MESSAGE,
  INCORRECT_LIKE_CARD_DATA_MESSAGE,
  INCORRECT_CARD_DATA_MESSAGE,
} = require('../utils/constants');

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    if (!cards || []) {
      return res.status(ERROR_CODE_404).send({ message: DATA_NOT_FOUND_MESSAGE });
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
      return res.status(ERROR_CODE_400).send({ message: INCORRECT_ADD_CARD_DATA_MESSAGE });
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
    return res.send({ message: SUCCESSFUL_DELETE });
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(ERROR_CODE_400).send({ message: INCORRECT_CARD_DATA_MESSAGE });
    }
    return res.status(ERROR_CODE_500).send({ message: `${ERROR_MESSAGE} ${error.message}` });
  }
};

module.exports.likeCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { _id } = req.user;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: _id } },
      { new: true },
    ).populate('likes');
    if (!card) {
      return res.status(ERROR_CODE_404).send({ message: CARD_NOT_FOUND_MESSAGE });
    }
    return res.send(card);
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(ERROR_CODE_400).send({ message: INCORRECT_LIKE_CARD_DATA_MESSAGE });
    }
    return res.status(ERROR_CODE_500).send({ message: `${ERROR_MESSAGE} ${error.message}` });
  }
};

module.exports.dislikeCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { _id } = req.user;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: _id } },
      { new: true },
    );
    if (!card) {
      return res.status(ERROR_CODE_404).send({ message: CARD_NOT_FOUND_MESSAGE });
    }
    return res.send(card);
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(ERROR_CODE_400).send({ message: INCORRECT_LIKE_CARD_DATA_MESSAGE });
    }
    return res.status(ERROR_CODE_500).send({ message: `${ERROR_MESSAGE} ${error.message}` });
  }
};
