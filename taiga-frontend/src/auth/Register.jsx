import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  InputAdornment
} from "@mui/material";
import { Person, Email, Lock } from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !email || !password) {
      alert("All fields are required");
      return;
    }

    try {
      await api.post("/auth/register", {
        username,
        email,
        password
      });

      alert("Registration successful. Please login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage:
          "url(https://images.unsplash.com/photo-1521737604893-d14cc237f11d)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: "rgba(255,255,255,0.95)",
            textAlign: "center"
          }}
        >
          {/* Branding */}
          <Typography variant="h5" fontWeight={700}>
            Taiga<span style={{ color: "#059669" }}>Front</span>
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#6b7280", mb: 3 }}
          >
            Agile Project Management
          </Typography>

          {/* Username */}
          <Typography
            sx={{ textAlign: "left", fontWeight: 500, mb: 0.5 }}
          >
            Username
          </Typography>
          <TextField
            fullWidth
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person sx={{ color: "#9ca3af" }} />
                </InputAdornment>
              )
            }}
          />

          {/* Email */}
          <Typography
            sx={{ textAlign: "left", fontWeight: 500, mb: 0.5 }}
          >
            Email address
          </Typography>
          <TextField
            fullWidth
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: "#9ca3af" }} />
                </InputAdornment>
              )
            }}
          />

          {/* Password */}
          <Typography
            sx={{ textAlign: "left", fontWeight: 500, mb: 0.5 }}
          >
            Password
          </Typography>
          <TextField
            fullWidth
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: "#9ca3af" }} />
                </InputAdornment>
              )
            }}
          />

          {/* Button */}
          <Button
            fullWidth
            variant="contained"
            onClick={handleRegister}
            sx={{
              py: 1.2,
              fontWeight: 600,
              backgroundColor: "#059669",
              "&:hover": {
                backgroundColor: "#047857"
              }
            }}
          >
            Register
          </Button>

          {/* Footer */}
          <Typography
            sx={{
              mt: 2,
              fontSize: "0.95rem",
              color: "#6b7280"
            }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: "#059669",
                fontWeight: 600,
                textDecoration: "none"
              }}
            >
              Sign in
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
