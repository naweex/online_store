const {
  createProductSchema,
} = require('../../validators/admin/product.schema');
const Controller = require('../controller');
const { deleteFileInPublic, listOfImagesFromRequest } = require('../../../utils/functions');
const { ProductModel } = require('../../../models/products');
const path = require('path');
class ProductController extends Controller {
  async addProduct(req, res, next) {
    try {
      const images = listOfImagesFromRequest(req?.files || [] , req.body.fileUploadPath)
      const productBody = await createProductSchema.validateAsync(req.body);

      const {
        title,
        text,
        short_text,
        category,
        tags,
        count,
        discount,
        price,
        width,
        height,
        length,
        weight,
      } = productBody;
      const supplier = req.user._id;

      let feature = {}
      feature.colors = colors;
      if (isNaN(width) || isNaN(height) || isNaN(length) || isNaN(weight)) {
        if (!width) feature.width = 0;
        else feature.width = width;
        if (!height) feature.height = 0;
        else feature.height = height;
        if (!length) feature.length = 0;
        else feature.length = length;
        if (!weight) feature.weight = 0;
        else feature.weight = weight;
      }

      const product = await ProductModel.create({
        title,
        text,
        short_text,
        category,
        tags,
        count,
        discount,
        price,
        images,
        feature,
        type
      });
      return res.json({
        data: {
          statusCode: 201,
          message: 'product register successfully',
        },
      });
    } catch (error) {
      deleteFileInPublic(req.body.image);
      next(error);
    }
  }
  editProduct(req, res, next) {
    try {
    } catch (error) {
      next(error);
    }
  }
  removeProduct(req, res, next) {
    try {
    } catch (error) {
      next(error);
    }
  }
  async getAllProducts(req, res, next) {
    try {
      const product = await ProductModel.find({})
      return res.status(200).json({
        data: {
          statusCode : 200 ,
          product
        }
      })
    } catch (error) {
      next(error);
    }
  }
  getOneProduct(req, res, next) {
    try {
    } catch (error) {
      next(error);
    }
  }
}

module.exports = {
  ProductController: new ProductController(),
};
