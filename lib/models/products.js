const Joi = require('joi');

const createBody = {
  productType: Joi.string().required(),
  productSubType: Joi.string().required(),
  productName: Joi.string().required(),
  sourceId: Joi.string().optional(),
  sourceCode: Joi.string().optional(),
};

const productId = Joi.string().required();

const updateBody = {
  productType: Joi.string().optional(),
  productSubType: Joi.string().optional(),
  productName: Joi.string().optional(),
  sourceId: Joi.string().optional(),
  sourceCode: Joi.string().optional(),
};

module.exports = {
  createBody,
  productId,
  updateBody,
};
