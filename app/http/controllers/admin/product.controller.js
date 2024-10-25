const {
  createProductSchema,
} = require('../../validators/admin/product.schema');
const Controller = require('../controller');
const { deleteFileInPublic } = require('../../../utils/functions')
class ProductController extends Controller {
  async addProduct(req, res, next) {
    try {
      const productBody = await createProductSchema.validateAsync(req.body);
      req.body.image = path.join(
        blogDataBody.fileUploadPath,
        blogDataBody.filename
      );
      req.body.image = req.body.image.replace(/\\/g, '/');
      const { title, text, short_text, category, tags , count,discount,price,width,height,length,weight } = blogDataBody;
      const image = req.body.image;
      const author = req.user._id;
      let feature = {}
      if(!width) feature.width = 0;
      else feature.width = width
      if(!height) feature.height = 0;
      else feature.height = height
      if(!length) feature.length = 0;
      else feature.length = length
      if(!weight) feature.weight = 0;
      else feature.weight = weight
      return res.json(productBody);
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
  getAllProducts(req, res, next) {
    try {
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
