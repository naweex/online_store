const {
  createProductSchema,
} = require('../../validators/admin/product.schema');
const Controller = require('../controller');
const {
  deleteFileInPublic,
  listOfImagesFromRequest,
  copyObject,
  setFeatures,
  deleteInvalidPropertyInObject,
} = require('../../../utils/functions');
const { ProductModel } = require('../../../models/products');
const path = require('path');
const { objectIdValidators } = require('../../validators/public.validator');
const createHttpError = require('http-errors');
const { StatusCodes: httpStatus } = require('http-status-codes');
const productBlackList = {
BOOKMARKS : 'bookmarks' ,
LIKES : 'likes' ,
DISLIKES : 'dislikes' ,
COMMENTS : 'comments' ,
SUPPLIER : 'supplier' ,
WEIGHT : 'weight' ,
HEIGHT : 'height' ,
WIDTH : 'width' ,
LENGTH : 'length' ,
COLORS : 'colors'
}
Object.freeze(productBlackList)
class ProductController extends Controller {
  async addProduct(req, res, next) {
    try {
      const images = listOfImagesFromRequest(
        req?.files || [],
        req.body.fileUploadPath
      );
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
      } = productBody;
      const supplier = req.user._id;
      let features = setFeatures(req.body)

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
        features,
        type,
      });
      return res.status(httpStatus.CREATED).json({
        statusCode: httpStatus.CREATED ,
        data: {
          message: 'product register successfully'
        },
      });
    } catch (error) {
      deleteFileInPublic(req.body.image);
      next(error);
    }
  }
  async editProduct(req, res, next) {
    try {
      const {id} = req.params;
      const product = await this.findProductById(id)
      const data = copyObject(req.body)
        data.images = listOfImagesFromRequest(req?.files || [],req.body.fileUploadPath);
        data.features = setFeatures(req.body)
        let blackListFields = Object.values(productBlackList)
        deleteInvalidPropertyInObject(data , blackListFields)
        const updateProductResult = await ProductModel.updateOne({_id : product.id} , {$set : data})
        if(updateProductResult.modifiedCount == 0) throw {status : httpStatus.INTERNAL_SERVER_ERROR , message : 'InternalServerError'}
        return res.status(httpStatus.OK).json({
          statusCode : httpStatus.OK ,
          data : {
            message : 'updated successfully'
          }
          
        })
    } catch (error) {
      next(error);
    }
  }
  async getAllProducts(req, res, next) {
    try {
      const search = req?.query?.search || '';
      let products;
      if (search) {
        products = await ProductModel.find({
          $text: {
            $search: new RegExp(search, 'ig'),
          }
        });
      } else {
        products = await ProductModel.find({});
      }
      return res.status(httpStatus.OK).json({
        statusCode: httpStatus.OK,
        data: {
          product
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async getOneProduct(req, res, next) {
    try {
      const { id } = req.params;
      const product = await this.findProductById(id);
      return res.status(httpStatus.OK).json({
        statusCode: httpStatus.OK,
        data : {
            product
        }
        
      });
    } catch (error) {
      next(error);
    }
  }
  async removeProductById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await this.findProductById(id);
      const removeProductResult = await ProductModel.deleteOne({
        _id: product._id,
      });
      if (removeProductResult.deletedCount == 0)
        throw createHttpError.InternalServerError();
      return res.status(httpStatus.OK).json({
        statusCode: httpStatus.OK,
        data : {
            message: 'product deleted successfully'
        }
        
      });
    } catch (error) {
      next(error);
    }
  }
  async findProductById(product) {
    const { id } = await objectIdValidators.validateAsync({ id: productID });
    const product = await ProductModel.findById(id);
    if (!product) throw createHttpError.NotFound('product not found');
    return product;
  }
}

module.exports = {
  ProductController: new ProductController(),
};
