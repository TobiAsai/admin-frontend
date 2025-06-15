import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import Link from "@mui/material/Link";
import { useNavigate } from "react-router";
import axios from "axios";


const LoginPage = () => {
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (loginForm.username.trim() === "" || loginForm.password.trim() === "") {
      alert("請輸入用戶名和密碼");
      return;
    }
    const response = await axios.post("http://localhost:8080/api/auth/login", loginForm);
    console.log("登入資料：", response.data);
    console.log("登入資料：", response.data.code);
    if (response.data.code === 200) {
      const token = response.data.token;
      localStorage.setItem("token", token);
      navigate("/main");
      return
    }
    alert("登入失敗，請檢查資料");
  };

  return (
    <Container
      maxWidth="xs"
      sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}
    >
      <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
        <Typography variant="h6" mb={2}>
          登入
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Username"
            type="text"
            value={loginForm.username}
            onChange={(e) =>
              setLoginForm({ ...loginForm, username: e.target.value })
            }
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={loginForm.password}
            onChange={(e) =>
              setLoginForm({ ...loginForm, password: e.target.value })
            }
            fullWidth
          />
          <Button variant="contained" onClick={handleLogin} fullWidth>
            登入
          </Button>
          <Typography sx={{ textAlign: "center" }}>
            Don&apos;t have an account?{" "}
            <Link href="/register" variant="body2" sx={{ alignSelf: "center" }}>
              Sign up
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
