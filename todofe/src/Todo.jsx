import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Checkbox,
  Tooltip,
  Select,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/system";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import instance from "./axiosInterceptor";

// Styled components for gradient background and layout
const GradientBackground = styled("div")({
  background: "radial-gradient(circle, rgba(5, 0, 0, 0.1), rgba(5, 0, 0, 0.1))",
  height: "100vh",
  width: "100vw",
  padding: "20px",
  color: "#fff",
  overflowY: "auto",
});

const ContentContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  marginTop: "20px",
});

const TaskContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  maxWidth: "600px",
  marginBottom: "10px",
  backgroundColor: "#333",
  padding: "10px",
  borderRadius: "5px",
});

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
    getAllTodos();
  }, []);

  const fetchUsers = async () => {
    instance
      .get("/users")
      .then((res) => {
        setUsers(res.data.users);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getAllTodos = async () => {
    instance
      .get("/todos")
      .then((res) => {
        const todos = res?.data?.todos?.map((item) => ({
          id: item.id,
          text: item.description,
          completed: item.status == 0 ? false : true,
          assignedTo: item.assignedTo,
        }));
        setTasks(todos);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Add a new task
  const handleAddTask = async () => {
    if (newTask.trim() && selectedUser) {
      instance
        .post("/todos", {
          title: newTask.slice(0, 10),
          description: newTask.trim(),
          status: false,
          assignedTo: selectedUser,
        })
        .then((res) => {
          setTasks([
            ...tasks,
            {
              id: Date.now(),
              text: newTask.trim(),
              completed: false,
              assignedTo: selectedUser,
            },
          ]);
        })
        .catch((err) => {
          console.log(err);
        });
      setNewTask("");
      setSelectedUser("");
    }
  };

  // Edit a task
  const handleEditTask = (id) => {
    const task = tasks.find((task) => task.id === id);
    setEditTaskId(id);
    setTaskToEdit(task.text);
    setSelectedUser(task.assignedTo);
  };

  // Save the edited task
  const handleSaveTask = () => {
    setTasks(
      tasks.map((task) =>
        task.id === editTaskId
          ? { ...task, text: taskToEdit, assignedTo: selectedUser }
          : task
      )
    );
    setEditTaskId(null);
    setTaskToEdit("");
    setSelectedUser("");
  };

  // Delete a task
  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Mark a task as completed
  const handleToggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Remove all tasks
  const handleRemoveAll = () => {
    setTasks([]);
  };

  return (
    <GradientBackground>
      <ContentContainer>
        <Typography variant="h4" gutterBottom>
          Todo List
        </Typography>
        <Box sx={{ width: "100%", maxWidth: "600px", marginBottom: "20px" }}>
          <TextField
            fullWidth
            label="Add New Task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            sx={{ marginBottom: "10px" }}
          />
          <Select
            fullWidth
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            displayEmpty
            sx={{ marginBottom: "10px" }}
          >
            <MenuItem value="" disabled>
              Select User
            </MenuItem>
            {users?.map((user) => (
              <MenuItem key={user.email} value={user.id}>
                {user.email}
              </MenuItem>
            ))}
          </Select>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleAddTask}
            disabled={!newTask.trim() || !selectedUser}
          >
            Add Task
          </Button>
        </Box>
        {tasks && tasks?.length > 0 && (
          <Button
            variant="outlined"
            color="error"
            onClick={handleRemoveAll}
            sx={{ marginBottom: "20px" }}
          >
            Remove All Tasks
          </Button>
        )}
        <Box>
          {tasks?.map((task) => (
            <TaskContainer key={task.id}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Checkbox
                  checked={task.completed}
                  onChange={() => handleToggleComplete(task.id)}
                  color="primary"
                />
                {editTaskId === task.id ? (
                  <>
                    <TextField
                      value={taskToEdit}
                      onChange={(e) => setTaskToEdit(e.target.value)}
                      size="small"
                      sx={{ marginRight: "10px", backgroundColor: "#fff" }}
                    />
                    <Select
                      value={selectedUser}
                      onChange={(e) => setSelectedUser(e.target.value)}
                      size="small"
                      sx={{ marginRight: "10px" }}
                    >
                      {users.map((user) => (
                        <MenuItem key={user.email} value={user.email}>
                          {user.email}
                        </MenuItem>
                      ))}
                    </Select>
                  </>
                ) : (
                  <Typography
                    variant="body1"
                    sx={{
                      textDecoration: task.completed ? "line-through" : "none",
                      color: task.completed ? "#aaa" : "#fff",
                    }}
                  >
                    {task.text} (Assigned to: {task.assignedTo})
                  </Typography>
                )}
              </Box>
              <Box>
                {editTaskId === task.id ? (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleSaveTask}
                    size="small"
                  >
                    Save
                  </Button>
                ) : (
                  <Tooltip title="Edit Task">
                    <IconButton
                      onClick={() => handleEditTask(task.id)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Delete Task">
                  <IconButton
                    onClick={() => handleDeleteTask(task.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </TaskContainer>
          ))}
        </Box>
      </ContentContainer>
    </GradientBackground>
  );
};

export default Todo;
