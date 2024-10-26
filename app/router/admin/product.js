const { ProductController } = require('../../http/controllers/admin/product.controller');
const { stringToArray } = require('../../http/middlewares/stringToArray');
const { uploadFile } = require('../../utils/multer');

const router = require('express').Router();
router.post('/add' , uploadFile.array('images' , 10),stringToArray('tags') , ProductController.addProduct)
router.get('/list' , ProductController.getAllProducts)
router.get('/:id' , ProductController.getOneProduct)
router.patch()
router.delete()
module.exports = {
    AdminApiProductRouter : router
}