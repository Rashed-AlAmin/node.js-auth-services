
const isAdmin=(req,res,next)=>{
    if(req.userInfo.role!=='admin'){
        return res.status(403).json({
            success:false,
            message:'user is not an admin'
        })
    }
    next();

}

module.exports=isAdmin