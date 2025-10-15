const Image=require('../models/image')
const {uploadToCloudinary}=require('../helper/cloudinaryHelper')
const fs=require('fs')

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

    }catch(e){
        console.log(e)
        res.status(500).json({
            success:false,
            message:'something went wrong'
        })
    }
}
module.exports=uploadImageController