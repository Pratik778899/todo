import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import instance from "./axiosInterceptor";
import { useNavigate } from "react-router";

const LoginAndRegister = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [role, setRole] = useState("assigner");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await instance.post("/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", JSON.stringify(response.data.user));
      if (response.data.token) {
        window.location.href = "/";
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Login Failed:", error.response?.data || error.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await instance.post("/register", {
        email,
        password,
        role,
      });
      setIsRegistering(false);
    } catch (error) {
      console.error(
        "Registration Failed:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to right, #6a11cb, #2575fc)", // Gradient background
        fontFamily: "Plus Jakarta Sans",
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          backgroundColor: "#fff",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Typography
          variant="h4"
          align="flex-start"
          gutterBottom
          sx={{ color: "#000", fontFamily: "Plus Jakarta Sans" }}
        >
          {isRegistering ? "Welcome To Register" : "Login"}
        </Typography>
        <Button onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? "Switch to Login" : "Switch to Register"}
        </Button>
        {isRegistering ? (
          <form onSubmit={handleRegister}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <TextField
              select
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              fullWidth
              margin="normal"
              required
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="assigner">Assigner</MenuItem>
            </TextField>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                marginTop: "1rem",
                padding: "0.75rem",
                background: "linear-gradient(to right, #6a11cb, #2575fc)",
                color: "#fff",
                fontWeight: "bold",
                fontFamily: "Plus Jakarta Sans",
                "&:hover": {
                  background: "linear-gradient(to right, #5a0eb7, #1f5bcc)",
                },
              }}
            >
              Register
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                marginTop: "1rem",
                padding: "0.75rem",
                background: "linear-gradient(to right, #6a11cb, #2575fc)",
                color: "#fff",
                fontWeight: "bold",
                fontFamily: "Plus Jakarta Sans",
                "&:hover": {
                  background: "linear-gradient(to right, #5a0eb7, #1f5bcc)",
                },
              }}
            >
              Login
            </Button>
          </form>
        )}
      </Container>
    </Box>
  );
};

export default LoginAndRegister;
