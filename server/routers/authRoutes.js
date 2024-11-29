const express=require("express");
const { protect } = require("../middleware/authMiddleware");
const { register, login,fetchUsers } = require("../controllers/authController");
const router=express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/users").get(protect,fetchUsers);

module.exports=router;