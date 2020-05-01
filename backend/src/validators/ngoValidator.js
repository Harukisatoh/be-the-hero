const { celebrate, Segments, Joi } = require('celebrate');

// Validates inputs from frontend and mobile
module.exports = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    whatsapp: Joi.string().pattern(/^[0-9]{10,11}$/).required(),
    city: Joi.string().required(),
    state: Joi.string().length(2).required()
  })
});