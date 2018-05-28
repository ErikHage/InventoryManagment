const productsDatasource = require('../../../../lib/services/products/datasource');
const productsService = require('../../../../lib/services/products');
const { getProductData } = require('../../../factories/products');
const {
  SOMETHING_WENT_WRONG,
  ERROR_EXPECTED,
} = require('../../../helpers/constants');

const productId = 'some-product-id';

describe('Products Service', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  const stubDatasource = func => sandbox.stub(productsDatasource, func);

  describe('#createProduct', () => {
    it('should successfully create a product', async () => {
      const product = getProductData({ productId });

      const stub = stubDatasource('create');
      stub.onCall(0).returns(Promise.resolve(product));

      const result = await productsService.createProduct(product);

      expect(productsDatasource.create).to.have.been.calledWith(product);
      expect(result).to.deep.equal(product);
    });

    it('should throw ERROR_CREATING_PRODUCT when there is a datasource error', async () => {
      const product = getProductData({ productId });

      const stub = stubDatasource('create');
      stub.onCall(0).returns(Promise.reject(SOMETHING_WENT_WRONG));

      try {
        await productsService.createProduct(product);
      } catch (err) {
        expect(err.code).to.be.equal('ERROR_CREATING_PRODUCT');
        expect(productsDatasource.create).to.have.been.calledWith(product);
        return;
      }
      throw ERROR_EXPECTED;
    });
  });

  describe('#getProductById', () => {
    it('should successfully read a product', async () => {
      const product = getProductData({ productId });

      const stub = stubDatasource('getById');
      stub.onCall(0).returns(Promise.resolve(product));

      const result = await productsService.getProductById(productId);

      expect(productsDatasource.getById).to.have.been.calledWith(productId);
      expect(result).to.deep.equal(product);
    });

    it('should throw ERROR_READING_PRODUCT when there is a datasource error', async () => {
      const stub = stubDatasource('getById');
      stub.onCall(0).returns(Promise.reject(SOMETHING_WENT_WRONG));

      try {
        await productsService.getProductById(productId);
      } catch (err) {
        expect(err.code).to.be.equal('ERROR_READING_PRODUCT');
        expect(productsDatasource.getById).to.have.been.calledWith(productId);
        return;
      }
      throw ERROR_EXPECTED;
    });
  });

  describe('#updateProduct', () => {
    it('should successfully update a product', async () => {
      const oldProduct = getProductData({ productId });
      const newProduct = getProductData({ productId, productName: 'updated' });

      const readStub = stubDatasource('getById');
      readStub.onCall(0).returns(Promise.resolve(oldProduct));

      const updateStub = stubDatasource('update');
      updateStub.onCall(0).returns(Promise.resolve(newProduct));

      const result = await productsService.updateProduct(newProduct);

      expect(productsDatasource.getById).to.have.been.calledWith(productId);
      expect(productsDatasource.update).to.have.been.calledWith(newProduct);
      expect(result).to.deep.equal(newProduct);
    });

    it('should throw ERROR_UPDATING_PRODUCT when there is a datasource read error', async () => {
      const newProduct = getProductData({ productId, productName: 'updated' });

      const readStub = stubDatasource('getById');
      readStub.onCall(0).returns(Promise.reject(SOMETHING_WENT_WRONG));

      stubDatasource('update');

      try {
        await productsService.updateProduct(newProduct);
      } catch (err) {
        expect(err.code).to.be.equal('ERROR_UPDATING_PRODUCT');
        expect(productsDatasource.getById).to.have.been.calledWith(productId);
        expect(productsDatasource.update).to.not.have.been.called();
        return;
      }
      throw ERROR_EXPECTED;
    });

    it('should throw ERROR_UPDATING_PRODUCT when there is a datasource update error', async () => {
      const oldProduct = getProductData({ productId });
      const newProduct = getProductData({ productId, productName: 'updated' });

      const readStub = stubDatasource('getById');
      readStub.onCall(0).returns(Promise.resolve(oldProduct));

      const updateStub = stubDatasource('update');
      updateStub.onCall(0).returns(Promise.reject(SOMETHING_WENT_WRONG));

      try {
        await productsService.updateProduct(newProduct);
      } catch (err) {
        expect(err.code).to.be.equal('ERROR_UPDATING_PRODUCT');
        expect(productsDatasource.getById).to.have.been.calledWith(productId);
        expect(productsDatasource.update).to.have.been.calledWith(newProduct);
        return;
      }
      throw ERROR_EXPECTED;
    });
  });

  describe('#deleteProductById', () => {
    it('should successfully delete a product', async () => {
      const product = getProductData({ productId });

      const stub = stubDatasource('deleteById');
      stub.onCall(0).returns(Promise.resolve(product));

      const result = await productsService.deleteProductById(productId);

      expect(productsDatasource.deleteById).to.have.been.calledWith(productId);
      expect(result).to.deep.equal(product);
    });

    it('should throw ERROR_DELETING_PRODUCT when there is a datasource error', async () => {
      const stub = stubDatasource('deleteById');
      stub.onCall(0).returns(Promise.reject(SOMETHING_WENT_WRONG));

      try {
        await productsService.deleteProductById(productId);
      } catch (err) {
        expect(err.code).to.be.equal('ERROR_DELETING_PRODUCT');
        expect(productsDatasource.deleteById).to.have.been.calledWith(productId);
        return;
      }
      throw ERROR_EXPECTED;
    });
  });
});
