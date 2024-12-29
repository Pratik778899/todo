const express = require("express");
const router = express.Router();
const {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  checkRole,
  allUsers,
} = require("../controller/todoController");
const { isLoggedIn } = require("../middleware/loginMiddleware");

router.use(isLoggedIn);

// router.get("/all-todos",  getAllTodos);
// router.get("/get-todo/:id", getTodoById);
// router.post("/create-todo", createTodo);
// router.put("/update-todo/:id", updateTodo);
// router.delete("/delete-todo/:id", deleteTodo);

router.get("/todos", getAllTodos);
router.post("/todos", checkRole(["assigner", "admin"]), createTodo);
router.put("/todos/:id", checkRole(["assigner", "admin"]), updateTodo);
router.delete("/todos/:id", checkRole(["admin"]), deleteTodo);
router.get("/users", allUsers);

module.exports = router;