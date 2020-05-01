const { celebrate, Segments, Joi } = require('celebrate');

// Validates inputs from frontend and mobile
module.exports = celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required()
  }).unknown(),
  [Segments.QUERY]: Joi.object().keys({
    page: Joi.number()
  })
});