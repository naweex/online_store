const multer = require('multer')
const path = require('path')
const fs = require('fs');
const createHttpError = require('http-errors');
function createRoutes (req){
    const date = new Date();
    const year = date.getFullYear().toString();
    const month = date.getMonth().toString();
    const day = date.getDate().toString();
    const directory = path.join(__dirname , '..' , '..' , 'public' , 'uploads' , 'blogs' , year , month , day)
    req.body.fileUploadPath = path.join('uploads' , 'blogs' , year , month , day)
    fs.mkdirSync(directory , {recursive : true})
    return directory
}
const storage = multer.diskStorage({
    destination : (req , file , cb) => {
        if(file?.originalname){
        const filePath = createRoutes(req);
        return cb(null , filePath)
        }
        cb(null , null)
    },
    filename : (req , file , cb) => {
    if(file?.originalname){
        const ext = path.extname(file.originalname);
        const fileName = String(new Date().getTime() + ext);
        req.body.filename = fileName
        return cb(null , fileName)
    }
        cb(null , null)
    }
});
function fileFilter(req , file , cb){
    const ext = path.extname(file.originalname);
    const mimeTypes = ['.jpg' , ',jpeg' , '.webp' , '.gif' , '.png']
    if(mimeTypes.includes(ext)){
        return cb(null , true)
    }
    return cb(createHttpError.BadRequest('format of file not accepted'))
}
function videoFilter(req , file , cb){
    const ext = path.extname(file.originalname);
    const mimeTypes = ['.mp4' , ',mov' , '.mkv' , '.mpg' , '.avi']
    if(mimeTypes.includes(ext)){
        return cb(null , true)
    }
    return cb(createHttpError.BadRequest('format of video not accepted'))
}
const imageMaxSize = 1 * 1000 * 1000
const videoMaxSize = 300 * 1000 * 1000
const uploadFile = multer({storage ,fileFilter, limits: {fileSize : imageMaxSize}})
const uploadVideo = multer({storage ,videoFilter, limits: {fileSize : videoMaxSize}})
module.exports = {
    uploadFile ,
    uploadVideo
}