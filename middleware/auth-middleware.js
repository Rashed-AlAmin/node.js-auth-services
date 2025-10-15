const jwt=require('jsonwebtoken')

const authMiddleware= (req,res,next)=>{
    const authHeader=req.headers['authorization'];
    const token=authHeader&&authHeader.split(" ")[1];
    if(!token){
        return res.status(401).json({
            success:false,
            message:'token not found, cannot access. login first'
        })
    }
    try{
        //decode token
        const decodedToken= jwt.verify(token,process.env.jwt_secret_key);
        console.log(decodedToken);
        //passing back to front end with the variable userInfo
        req.userInfo=decodedToken;
        next();
    }catch(e){
        return res.status(500).json({
            message:'something went wrong. token is not valid'
        })
    }
}
module.exports=authMiddleware