const Joi = require('joi');

const productsModel = require('../../../lib/models/products');
const { getProductData } = require('../../factories/products');

const runTest = (obj, schema, isError) => {
  const result = Joi.validate(obj, schema);

  if (isError) {
    expect(result.error).to.not.be.null();
  } else {
    expect(result.error).to.be.null();
  }
};

describe('Products Model', () => {
  describe('#createBody', () => {
    it('should successfully validate the body', () => {
      runTest(getProductData(), productsModel.createBody, false);
    });

    it('should fail if a required field is not present', () => {
      const body = getProductData();
      delete body.productName;

      runTest(body, productsModel.createBody, true);
    });

    it('should succeed if an optional field is not present', () => {
      const body = getProductData();
      delete body.sourceId;

      runTest(body, productsModel.createBody, false);
    });
  });

  describe('#productId', () => {
    it('should successfully validate the id', () => {
      runTest('some-product-id', productsModel.productId, false);
    });

    it('should succeed if the id is not present', () => {
      runTest({}, productsModel.productId, true);
    });
  });

  describe('#updateBody', () => {
    it('should successfully validate the body', () => {
      runTest(getProductData(), productsModel.updateBody, false);
    });

    it('should succeed if an optional field is not present', () => {
      const body = getProductData();
      delete body.sourceId;

      runTest(body, productsModel.updateBody, false);
    });
  });
});
