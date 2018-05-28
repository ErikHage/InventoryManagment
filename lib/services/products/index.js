const productsDatasource = require('./datasource');
const errorFactory = require('../../errors/error-factory');

const createProduct = async (product) => {
  try {
    return await productsDatasource.create(product);
  } catch (err) {
    throw errorFactory.getErrorFromCode('ERROR_CREATING_PRODUCT', { product }, err);
  }
};

const getProductById = async (productId) => {
  try {
    return await productsDatasource.getById(productId);
  } catch (err) {
    throw errorFactory.getErrorFromCode('ERROR_READING_PRODUCT', { productId }, err);
  }
};

const updateProduct = async (product) => {
  try {
    const existingProduct = await getProductById(product.productId);
    const updatedProduct = Object.assign(existingProduct, product);
    return await productsDatasource.update(updatedProduct);
  } catch (err) {
    throw errorFactory.getErrorFromCode('ERROR_UPDATING_PRODUCT', { product }, err);
  }
};

const deleteProductById = async (productId) => {
  try {
    return await productsDatasource.deleteById(productId);
  } catch (err) {
    throw errorFactory.getErrorFromCode('ERROR_DELETING_PRODUCT', { productId }, err);
  }
};

module.exports = {
  createProduct,
  getProductById,
  updateProduct,
  deleteProductById,
};
