const { celebrate, Segments, Joi } = require('celebrate');

// Validates inputs from frontend and mobile
module.exports = celebrate({
  [Segments.BODY]: Joi.object().keys({
    id: Joi.string().required()
  })
});