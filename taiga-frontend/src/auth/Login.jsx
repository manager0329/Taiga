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
import { Email, Lock } from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "./AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", {
        email,
        password
      });

      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      if (err.response?.status === 401) {
        alert("Invalid email or password");
      } else {
        alert("Server error. Please try again.");
      }
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
          <Typography variant="h5" fontWeight={700}>
            Taiga<span style={{ color: "#059669" }}>Front</span>
          </Typography>

          <Typography sx={{ color: "#6b7280", mb: 3 }}>
            Agile Project Management
          </Typography>

          <Typography sx={{ textAlign: "left", fontWeight: 500 }}>
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

          <Typography sx={{ textAlign: "left", fontWeight: 500 }}>
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

          <Button
            fullWidth
            variant="contained"
            onClick={handleLogin}
            disabled={loading}
            sx={{
              py: 1.2,
              fontWeight: 600,
              backgroundColor: "#059669",
              "&:hover": {
                backgroundColor: "#047857"
              }
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          <Typography sx={{ mt: 2, color: "#6b7280" }}>
            Don’t have an account?{" "}
            <Link
              to="/register"
              style={{
                color: "#059669",
                fontWeight: 600,
                textDecoration: "none"
              }}
            >
              Register
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;