const getProductData = (overrides) => Object.assign({
  productType: 'some-product-type',
  productSubType: 'some-product-sub-type',
  productName: 'some-product-name',
  sourceId: 'some-source-id',
  sourceCode: 'some-source-code',
}, overrides);

module.exports = {
  getProductData,
};
