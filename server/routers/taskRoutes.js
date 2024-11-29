const express=require("express");
const { protect } = require("../middleware/authMiddleware");
const { fetchTasks, createTask, deleteTask, updateTask, taskById,changeStatus, assignTask } = require("../controllers/tasksController");
const router=express.Router();

router.route("/").get(protect,fetchTasks);
router.route("/").post(protect,createTask);
router.route("/:id").delete(protect,deleteTask);
router.route("/:id").put(protect,updateTask);

router.route("/task-by-id/:id").get(protect,taskById);
router.route("/change-status/:id").put(protect,changeStatus);
router.route("/assign-task/:taskId").put(protect,assignTask)
module.exports=router;



