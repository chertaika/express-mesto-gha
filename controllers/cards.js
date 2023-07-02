const Card = require('../models/card');
const {
  CARD_NOT_FOUND_MESSAGE,
  INCORRECT_ADD_CARD_DATA_MESSAGE,
  INCORRECT_LIKE_CARD_DATA_MESSAGE,
  INCORRECT_CARD_DATA_MESSAGE,
  NO_RIGHTS_TO_DELETE_ERROR_MESSAGE,
} = require('../utils/constants');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const checkData = (data) => {
  if (!data) throw new NotFoundError(CARD_NOT_FOUND_MESSAGE);
};

module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (error) {
    return next(error);
  }
};

module.exports.createCard = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner });
    return res.send(card);
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return next(new BadRequestError(INCORRECT_ADD_CARD_DATA_MESSAGE));
    }
    return next(error);
  }
};

module.exports.deleteCardById = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);
    checkData(card);

    const ownerId = card.owner.valueOf();
    const userId = req.user._id;
    if (ownerId !== userId) next(new ForbiddenError(NO_RIGHTS_TO_DELETE_ERROR_MESSAGE));

    await Card.findByIdAndRemove(cardId);
    return res.send(card);
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return next(new BadRequestError(INCORRECT_CARD_DATA_MESSAGE));
    }
    return next(error);
  }
};

module.exports.likeCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const { _id } = req.user;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: _id } },
      { new: true },
    ).populate('likes');
    checkData(card);
    return res.send(card.likes);
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return next(new BadRequestError(INCORRECT_LIKE_CARD_DATA_MESSAGE));
    }
    return next(error);
  }
};

module.exports.dislikeCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const { _id } = req.user;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: _id } },
      { new: true },
    );
    checkData(card);
    return res.send(card.likes);
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return next(new BadRequestError(INCORRECT_LIKE_CARD_DATA_MESSAGE));
    }
    return next(error);
  }
};
