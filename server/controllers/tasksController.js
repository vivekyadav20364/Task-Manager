const Task=require("../models/tasksModel");
const fetchTasks = async (req, res) => {
    const { page = 1, limit = 5 } = req.query;
    const userId=req.user.id;
    if(!userId){
        return res.status(404).json({message:"user not found"});
    }

    try {
      const tasks = await Task.find(
        {$or:[{userId},{assignedTo:userId}]}
      ).populate("assignedTo")
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .sort({ dueDate: 1 }); // Sort by due date
      
      const totalTasks = await Task.countDocuments({ 
        $or: [{ userId }, { assignedTo: userId }] 
      });

      res.status(200).json({
        tasks,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalTasks / limit),
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  };

const createTask = async (req, res) => {
    const { title, description, dueDate, priority } = req.body;
    console.log(req.body)
    const userId=req.user.id;
    if(!userId){
        return res.status(404).json({message:"user not found"});
    }

    try {
      const newTask = new Task({ userId,title, description, dueDate, priority, status: 'Pending' });
      await newTask.save();
  
      res.status(201).json({ message: 'Task created successfully', task: newTask });
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Failed to create task' });
    }
  };

const deleteTask=async(req,res)=>{
  const id=req.params.id;
  console.log(id);  
  try {
    const resp=await Task.findByIdAndDelete(id);
    console.log(resp);
    return res.status(200).json({message:"Task deleted",success:true});
  } catch (error) {
    console.log(error);
    return res.status(400).json({message:"Error occured in deletion",success:false});

  }
}

const updateTask = async (req, res) => {
  const { id } = req.params; 
  const { title, description, dueDate } = req.body; 

  if (!id) {
    return res.status(400).json({ message: "Task ID is required." });
  }

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { $set: { title, description, dueDate } }, // Update only these fields
      { new: true, runValidators: true } // Return the updated task and validate the data
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found." });
    }

    return res.status(200).json({
      message: "Task updated successfully.",
      task: updatedTask,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while updating the task." });
  }
};

const taskById = async (req, res) => {
  const { id } = req.params; 
  //console.log("Called",id);
  if (!id) {
    return res.status(400).json({ message: "Task ID not provided" }); // Use 400 for bad request
  }

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" }); // Return 404 if no task found
    }
    return res.status(200).json({message:"success",task:task}); // Return 200 for success
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({ message: "Server error occurred" }); // Use 500 for server errors
  }
};

const changeStatus=async(req,res)=>{
  const {id}=req.params;
  const {status}=req.body;

 // console.log(id,status);
  try {
    const resp=await Task.findByIdAndUpdate(
     id,
     {$set:{status}},
     {new:true,runValidators:true} 
    )
    if (!resp) {
      return res.status(404).json({ message: "Task not found." });
    }

    return res.status(200).json({
      message: "status changed successfully.",
      task: resp,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while changing the status." });
  }
}

const assignTask=async(req,res)=>{
  const {taskId}=req.params;
  const id=req.body.selectedUserId;
  console.log(taskId,id);
  try {
    const resp=await Task.findByIdAndUpdate(
     taskId,
     {$set:{assignedTo:id}},
     {new:true,runValidators:true}
    )
   //console.log("AFTER ASSIGN",resp);
    if(!resp){
      return res.status(400).json("No Task found");
    }

    return res.status(200).json({message:"Assigned task Succesfully",res:resp});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while assigning task." });
  }
}


module.exports={fetchTasks,createTask,deleteTask,updateTask,taskById,changeStatus,assignTask}