import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import "./LoginForm.css";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const predefinedUsername = "admin";
  const predefinedPassword = "password123";

  const handleSubmit = (event) => {
    event.preventDefault();

    if (username === predefinedUsername && password === predefinedPassword) {
      // Display alert (optional)
      alert("Login successful! Redirecting to the dashboard...");

      // Redirect to the dashboard
      navigate("/dashboard");
    } else {
      setErrorMessage("Invalid username or password.");
    }
  };

  return (
    <Box className="login-container">
      {/* Logo */}
      <img
        src="https://www.febatech.com/wp-content/uploads/2021/08/febatech-300x74-1.png"
        alt="FEBA Tech Logo"
        className="logo"
      />
        Welcome to Feba HRMS
      {/* Login Form */}
      <Box
        component="form"
        className="login-form"
        onSubmit={handleSubmit}
      >
        <Typography variant="h6" gutterBottom>
          Login
        </Typography>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="submit-button"
        >
          Submit
        </Button>
        {errorMessage && (
          <Typography
            variant="body2"
            color="error"
            className="error-message"
            style={{ marginTop: "10px" }}
          >
            {errorMessage}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default LoginForm;