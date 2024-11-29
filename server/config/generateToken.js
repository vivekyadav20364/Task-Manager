const jwt=require('jsonwebtoken')

const generateToken=(id)=>{
    return jwt.sign({id},process.env.token,{expiresIn:"5h",});
};

module.exports=generateToken;