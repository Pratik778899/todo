const { Op } = require('sequelize');
const Login = require("../model/login");
const Todo = require("../model/todoModel");

exports.checkRole = (roles) => (req, res, next) => {  
    const userRole = req.user.role; // Assuming user role is stored in `req.user`
    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };

  


exports.getAllTodos = async (req, res) => {
  const { role, id: userId } = req.user;

  try {
    let todos;

    if (role === "admin") {
      // Admin gets all todos
      todos = await Todo.findAll();
    } else {
      // Fetch todos based on assigner or assignedTo
      todos = await Todo.findAll({
        where: {
          [Op.or]: [
            { assigner: userId },   // Todos created by the user
            { assignedTo: userId } // Todos assigned to the user
          ]
        }
      });
    }

    res.status(200).json({
      message: "Todos fetched successfully",
      todos,
    });
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

  

exports.getTodoById = async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await Todo.findByPk(id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(200).json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.createTodo = async (req, res) => {
    const { title, description, status, assignedTo } = req.body;
    const assigner = req.user.id; // Assuming logged-in user's ID is available
  
    try {
      const todo = await Todo.create({
        title,
        description,
        status,
        assignedTo,
        assigner,
      });
  
      // Send notification to the assigned user
      if (assignedTo) {
        // Replace this with your custom notification logic
        console.log(`Task assigned to user ID: ${assignedTo}`);
      }
  
      res.status(201).json(todo);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  };

  exports.allUsers = async (req, res) => {
    try {
      const users = await Login.findAll();
      res.status(200).json({
        message: "Users fetched successfully",
        users,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  };
  

  exports.updateTodo = async (req, res) => {
    const { id } = req.params;
    const { title, description, status, assignedTo } = req.body;
  
    try {
      const todo = await Todo.findByPk(id);
      if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
      }
  
      await Todo.update(
        { title, description, status, assignedTo },
        { where: { id } }
      );
  
      // Notify the new assigned user if assignedTo is updated
      if (assignedTo && assignedTo !== todo.assignedTo) {
        console.log(`Task re-assigned to user ID: ${assignedTo}`);
      }
  
      res.status(200).json({ message: "Task updated" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  };
  

exports.deleteTodo = async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await Todo.destroy({
      where: { id },
    });
    res.status(200).json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

