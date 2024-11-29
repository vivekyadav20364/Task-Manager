const User=require("../models/usersModel");
const bcrypt = require('bcrypt');
const generateToken=require("../config/generateToken");
const register=async (req,res)=>{
  const { name, email, password} = req.body;
    console.log(req.body)
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please Enter all the Fields");
    }
  
    const userExists = await User.findOne({ email});
    if (userExists) {
       return res.status(200).send({message:"User already exist",success:true});
    }
  
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);
    const newpassword=hashedPassword;
  
    const user = await User.create({
      name,
      email,
      password:newpassword,
      
    });
    console.log(user);
  
    if (user) {
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,        
      });
    } else {
      res.status(400);
      throw new Error("Failed to create the User");
    }
}

const login=async(req,res)=>{
    const {email,password}=req.body;
  
    const user=await User.findOne({email});
    if(!user){
      return res.status(200).send({message:'user not found',sucess:false})
    }
    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(200).send({message:'Invalid Email or Password' ,sucess:false});
    }
    if(isMatch){
        res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          token:generateToken(user._id),
          message:"successful",
        });
    }
};

const fetchUsers=async(req,res)=>{
  try {
    const resp=await User.find({});
    return res.status(200).json(resp); 
  } catch (error) {
    console.log("error occured",error);
    return res.status(500).json("Server Error");
  }
}

module.exports={register,login,fetchUsers}
