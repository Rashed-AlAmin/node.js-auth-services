const express=require('express')
const authMiddleware=require('../middleware/auth-middleware')
const adminMiddleware=require('../middleware/admin-middleware')
const uploadMiddleware=require('../middleware/upload-middleware')
const {uploadImageController,fetchImageController,deleteImageController}=require('../controller/image-controller')
const router=express.Router()

//upload the image

router.post('/upload',authMiddleware, adminMiddleware, uploadMiddleware.single('image'),uploadImageController)


//get all the images

router.get('/get',authMiddleware,fetchImageController)

//delete an image
router.delete('/delete/:id',authMiddleware,adminMiddleware,deleteImageController)

module.exports=router