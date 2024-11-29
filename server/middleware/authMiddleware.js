const jwt=require('jsonwebtoken');
const User=require("../models/usersModel");

const protect=async (req,res,next)=>{
    let token;
    
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
      try {
        token=req.headers.authorization.split(" ")[1];

        //decode token id
        const decoded=jwt.verify(token,process.env.token);
       
        req.user=await User.findById(decoded.id).select("-password"); //return without password
        next();
       // console.log("Authorized user")
      } catch (error) {
        res.sendStatus(401);
        throw new Error("Not authorized,token failed");
      }
    }

    if(!token){
        res.sendStatus(401);
        throw new Error("Not authorizes,no token");
       
    }
};

module.exports={protect};