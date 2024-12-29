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
  // background: "radial-gradient(circle, rgba(5, 0, 0, 0.1), rgba(5, 0, 0, 0.1))",
  height: "100vh",
  width: "100vw",
  padding: "20px",
  color: "#fff",
  overflowY: "auto",
  fontFamily: "Plus Jakarta Sans",
});

const ContentContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  marginTop: "20px",
  fontFamily: "Plus Jakarta Sans",
});

const TaskContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "50rem",
  // maxWidth: "100%",
  marginBottom: "10px",
  backgroundColor: "#333",
  padding: "10px",
  borderRadius: "5px",
  fontFamily: "Plus Jakarta Sans",
});

const LogoutButton = styled(Button)({
  marginTop: "20px",
  backgroundColor: "#f44336",
  color: "#fff",
  '&:hover': {
    backgroundColor: "#d32f2f",
  },
});

const Todo = () => {
  const userRole = localStorage.getItem("userId");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [users, setUsers] = useState([]);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    fetchUsers();
    getAllTodos();
  }, []);

  const fetchUsers = async () => {
    instance
      .get("/users")
      .then((res) => {
        const userLoggedIn = JSON.parse(localStorage.getItem("userId"));        
        setUsers(res.data.users.filter((user) => user.id !== userLoggedIn.id));
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
          title: item.title,
          text: item.description,
          completed: item.status == 0 ? false : true,
          assignedTo: item.assignedTo,
          user: userRole,
        }));
        setTasks(todos);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Add a new task
  const handleAddTask = async () => {
    if (newTask.trim() && selectedUser && newTitle.trim()) {
      instance
        .post("/todos", {
          title: newTitle.slice(0, 50),
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
              user: userRole,
              title: newTitle.slice(0, 50),
            },
          ]);
        })
        .catch((err) => {
          console.log(err);
        });
      setNewTask("");
      setSelectedUser("");
      setNewTitle("");
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
  const handleSaveTask = async () => {
    await instance.put(`/todos/${editTaskId}`, {
      description: taskToEdit,
      user: userRole,
    });
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

  const onDelete = async (id) => {
    await instance
      .delete(`/todos/${id}`)
      .then((res) => {
        setTasks(tasks.filter((task) => task.id !== id));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Mark a task as completed
  const handleToggleComplete = async (id) => {
    await instance
      .put(`/todos/${id}`, {
        status: tasks.find((task) => task.id === id).completed ? false : true,
      })
      .then((res) => {
        setTasks(
          tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          )
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Remove all tasks
  const handleRemoveAll = () => {
    setTasks([]);
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const getUserEmail = (userId) => {
    return users.find(user => user.id === userId)?.email || 'Unknown User';
  };

  return (
    <GradientBackground>
      <LogoutButton variant="contained" onClick={handleLogout}>
          Logout
        </LogoutButton>
      <ContentContainer>
        <Typography variant="h4" gutterBottom sx={{color:"#000"}}>
          Todo List
        </Typography>
        <Box sx={{ width: "100%", maxWidth: "600px", marginBottom: "20px" }}>
          <TextField
            fullWidth
            label="Task Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            sx={{ marginBottom: "10px" }}
          />
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
                      value={getUserEmail(task.assignedTo)}
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
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    <Typography
                      variant="h6"
                      sx={{
                        textDecoration: task.completed ? "line-through" : "none",
                        color: task.completed ? "#aaa" : "#fff",
                        fontWeight: "bold",
                        marginBottom: "5px",
                      }}
                    >
                      title:- {task.title}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        textDecoration: task.completed ? "line-through" : "none",
                        color: task.completed ? "#aaa" : "#fff",
                        fontWeight: "bold",
                        marginBottom: "5px",
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        color:"orange"
                      }}
                    >
                      <Typography variant="body1">description:-</Typography> {task.text}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: task.completed ? "#aaa" : "#fff",
                        fontStyle: "italic",
                      }}
                    >
                      Assigned to: {getUserEmail(task.assignedTo).replace("@gmail.com", "")}
                    </Typography>
                  </Box>
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
                  <IconButton onClick={() => onDelete(task.id)} color="error">
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
