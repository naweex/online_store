const createHttpError = require("http-errors");
const { CategoryModel } = require("../../../../models/categories");
const Controller = require("../../controller");
const { addCategorySchema, updateCategorySchema } = require("../../../validators/admin/category.schema");
const mongoose = require('mongoose')
const  {StatusCodes : httpStatus}= require('http-status-codes')
class CategoryController extends Controller {
    async addCategory(req , res , next){
        try {
            await addCategorySchema.validateAsync(req.body)
            const {title , parent} = req.body
            const category = await CategoryModel.create({title , parent})
            if(!category) throw new createHttpError.InternalServerError('Internal Server Error');
            return res.status(httpStatus.CREATED).json({
                statusCode : httpStatus.CREATED ,
                data : {
                    message : 'category added successfully'
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async removeCategory(req , res , next){
        try {
            const {id} = req.params;
            const category = await this.checkExistCategory(id);
            const deleteResult = CategoryModel.deleteMany({$or : [
                {_id : category._id} ,
                {parent : category._id}

            ]})
            if(await deleteResult.deletedCount == 0) throw createHttpError.InternalServerError('category not deleted successfully')
            res.status(httpStatus.OK).json({
                    statusCode : httpStatus.OK ,
                data: {                  
                    message : 'category deleted successfully'
                }    
            }) 
            
        } catch (error) {
            next(error)
        }
    }
    async editCategoryTitle(req , res , next){
        try {
            const {id} = req.params;
            const {title} = req.body;
            const category = await this.checkExistCategory(id)
            await updateCategorySchema.validateAsync(req.body)
            const resultUpdate = await CategoryModel.updateOne({_id : id} , {$set : {title}})
            if(resultUpdate.modifiedCount == 0) throw createHttpError.InternalServerError('category not updated')
                return res.status(httpStatus.OK).json({
                    statusCode : httpStatus.OK ,
                    data : {                      
                        message : 'updated successfully'
                    }
            })
        } catch (error) {
            next(error)
        }
    }
    async getAllCategory(req , res , next){
        try {
          //const category = await CategoryModel.aggregate([
           // {
               // $lookup : {
                   // from : 'categories' ,
                  //  localField : '_id' ,
                  //  foreignField : 'parent' ,
                  //  as : 'children'
              //  } 
           // },
          //  {
               // $project : {
                   // __v : 0 ,
                   // 'children.__v' : 0 ,
                    //'children.parent' : 0
                //}
           // },
           // {
                //$match : {
                   // parent : undefined
               // }
            //}

        //])
        //const categories = await CategoryModel.aggregate([
            //{
                //$graphLookup : {
                    //from : 'categories' ,
                    //startWith : '$_id' ,
                    //connectFromField : '_id' ,
                    //connectToField : 'parent' ,
                    //maxDepth : 5 ,
                    //depthField : 'depth' ,
                    //as : 'children'
                //} 
            //},
            //{
                //$project : {
                    //__v : 0 ,
                    //'children.__v' : 0 ,
                    //'children.parent' : 0
                //}
            //},
            //{
                //$match : {
                    //parent : undefined
                //}
            //}

        //])
        const categories = await CategoryModel.find({parent : undefined} , {__v : 0 ,})
           return res.status(httpStatus.OK).json({
            statusCode : httpStatus.OK ,
            data:{               
                categories
            }
        })  
        } catch (error) {
            next(error)
        }
    }
    async getCategoryById(req , res , next){
        try {
            const {id : _id} = req.params;
            const category = await CategoryModel.aggregate([
                {
                    $match : { _id : mongoose.Types.ObjectId(_id) }
                },
                {
                    $lookup : {
                        from : 'categories' ,
                        localField : '_id' ,
                        foreignField : 'parent' ,
                        as : 'children'
                    } 
                },
                {
                    $project : {
                        __v : 0 ,
                        'children.__v' : 0 ,
                        'children.parent' : 0
                    }
                }
            ])
            return res.status(httpStatus.OK).json({
                statusCode : httpStatus.OK ,
                data : {                  
                    category
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async getAllParents(req , res , next){
        try {
            const parents = await CategoryModel.find({parent : undefined} , {__v : 0})
            return res.status(httpStatus.OK).json({
                statusCode : httpStatus.OK ,
                data: {                   
                    parents
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async getChildOfParents(req , res , next){
        try {
            const {parent} = req.params;
            const children = await CategoryModel.find({parent} ,{__v : 0 , parent : 0})
            return res.status(httpStatus.OK).json({
                statusCode : httpStatus.OK ,
                data: {                  
                    children
                }
            })
            
        } catch (error) {
            next(error)
        }
    }
    async getAllCategoryWithOutPopulate(req , res , next){
        try {
            const categories = await CategoryModel.aggregate([
                {$match : {}}
            ]);
            return res.status(httpStatus.OK).json({
                statusCode : httpStatus.OK ,
                data : {
                    categories
                }
            })
            
        } catch (error) {
            next(error)
        }
    }
    async checkExistCategory(id){
        const category = await CategoryModel.findById(id);
        if(!category) throw createHttpError.NotFound('category not found');
        return category
    }
}
module.exports = {
    CategoryController : new CategoryController()
}