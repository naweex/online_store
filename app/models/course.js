const { default: mongoose } = require("mongoose");
const { commentSchema } = require("./public.schema");
const { ref, string } = require("joi");
const { text } = require("body-parser");
const Episode = mongoose.Schema({
    title : {type : String , required : true} ,
    text : {type : String , required : true} ,
    type : {type : String , default : 'free'} ,
    time : {type : String , required : true}
})
const Chapter = mongoose.Schema({
    title : {type : String , required : true} ,
    text : {type : String , default : ''} ,
    episodes : {type : [Episode] , default : []} , 
})
const courseSchema = new mongoose.Schema({
    title : {type : String , required : true} ,
    short_text : {type : String , required : true} ,
    text : {type : String , required : true} ,
    image : {type : String , required : true} ,
    tags : {type : [String] , default : []} ,
    category : {type : mongoose.Types.ObjectId ,ref : 'category', required : true} ,
    comments : {type : [commentSchema] , default : []} ,
    likes : {type : [mongoose.Types.ObjectId] , default : []} ,
    dislikes : {type : [mongoose.Types.ObjectId] , default : []} ,
    bookmarks : {type : [mongoose.Types.ObjectId] , default : []} ,
    price : {type : Number , default : 0} ,
    discount : {type : Number , default : 0 } ,
    type : {type : String , default : 'free'/*free , cash , special */,required : true} ,
    status : {type : String , default : 'not started' ,/*notStarted,completed,opening*/} ,
    time : {type : String , default :'00:00:00'} ,
    teacher : {type : mongoose.Types.ObjectId,ref : 'user', required : true} ,
    chapters : {type : [Chapter] , default : [] } ,
    students : {type : [mongoose.Types.ObjectId] , default : [] ,ref: 'user' }
});
courseSchema.index({title : 'text' , short_text : 'text' , text : 'text'})

module.exports = {
    CourseModel : mongoose.model('course' , courseSchema)
}