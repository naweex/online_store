const { ref } = require("joi");
const { default: mongoose } = require("mongoose");

const Schema = new mongoose.Schema({
    title : {type : String , required : true} ,
    parent : {type : mongoose.Types.ObjectId ,ref : 'category', default : undefined}
});
Schema.virtual('children' , {
    ref : 'category' ,
    localField : '_id' ,
    foreignField : 'parent'
})

module.exports = {
    CategoryModel : mongoose.model('category' , Schema)
}