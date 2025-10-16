const Image=require('../models/image')
const {uploadToCloudinary}=require('../helper/cloudinaryHelper')
const fs=require('fs')
const cloudinary=require('../config/cloudinary')


const uploadImageController= async (req, res)=>{
    try{
        //if file is missing in req obj
        if(!req.file){
            return res.status(400).json({
                success:false,
                message:'file is required, upload an image'
            })
        }
        //upload to cloudinary
        const {url,publicId}=await uploadToCloudinary(req.file.path)

        //store the url, pubId and userId of the uploader in the database
        const newlyUploadedImage= new Image({
            url,
            publicId,
            uploadedBy:req.userInfo.userId
        })
        await newlyUploadedImage.save();

        // delete the file from local storage
        //fs.unlinkSync(req.file.path)

        res.status(201).json({
            success:true,
            message:'image uploaded',
            image:newlyUploadedImage
        })

    }catch(error){
        console.log(error)
        res.status(500).json({
            success:false,
            message:'something went wrong'
        })
    }
}


const fetchImageController= async (req, res)=>{
    try{
        const page=parseInt(req.query.page)||1;
        const limit=parseInt(req.query.limit)||5;
        const skip=(page-1)*limit;

        const sortBy=req.query.sortBy||'createdAt';
        const sortOrder=req.query.sortOrder==='asc'?-1:1;
        const totalImages=await Image.countDocuments();
        const totalPages=Math.ceil(totalImages/limit)
        
        const sortObj={};
        sortObj[sortBy]=sortOrder
        const images=await Image.find().sort(sortObj).skip(skip).limit(limit);

        if(images){
            res.status(200).json({
            success:true,
            currentPage:page,
            totalPages:totalPages,
            totalImages:totalImages,
            data:images
            })
        }
    }catch(e){
        console.log(e)
        res.status(500).json({
            success:false,
            message:'something went wrong'
        })
    }
}

const deleteImageController=async (req,res)=>{
    try{
        const idOfImageToBeDeleted= req.params.id;
        const userId=req.userInfo.userId;
        const image=await Image.findById(idOfImageToBeDeleted)
        if(!image){
            return res.status(404).json({
                success:false,
                message:'image could not be found'
            })
        }
        if(image.uploadedBy.toString()!==userId){
            return res.status(400).json({
                success:false,
                message:'cannot delete the image coz you did not upload it'
            })
        }
        //delete picture from cloudinary
        await cloudinary.uploader.destroy(image.publicId)
        //delete from mongodb database
        await Image.findByIdAndDelete(idOfImageToBeDeleted)
        res.status(200).json({
            success:true,
            message:'image deleted successfully'
        })
    }catch(e){
        console.log(e)
        res.status(500).json({
            success:false,
            message:'something went wrong'
        })
    }
}

module.exports={uploadImageController,fetchImageController,deleteImageController}