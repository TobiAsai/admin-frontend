import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import Link from "@mui/material/Link";
import axios from "axios";

const RegisterPage = () => {
  const [registerForm, setRegisterForm] = useState({ username: "", password: "", state: "active" });
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (registerForm.username.trim() === "" || registerForm.password.trim() === "") {
      alert("請輸入用戶名和密碼");
      return;
    }
    console.log("註冊資料：", registerForm);
    const response = await axios.post("http://localhost:8080/api/auth/register", registerForm);
    console.log("註冊資料：", response.data);
    console.log("註冊資料：", response.data.code);
    if (response.data.code === 200) {
      alert("註冊成功！");
      navigate("/login");
      return
    }
    alert("註冊失敗！");
    // TODO: 呼叫 API 註冊
  };

  return (
    <Container
      maxWidth="xs"
      sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}
    >
      <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
        <Typography variant="h6" mb={2}>
          註冊
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Username"
            value={registerForm.username}
            onChange={(e) =>
              setRegisterForm({ ...registerForm, username: e.target.value })
            }
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={registerForm.password}
            onChange={(e) =>
              setRegisterForm({ ...registerForm, password: e.target.value })
            }
            fullWidth
          />
          <Button variant="contained" onClick={handleRegister} fullWidth>
            註冊
          </Button>
          <Typography sx={{ textAlign: "center" }}>
            Already have an account?{" "}
            <Link href="/login" variant="body2" sx={{ alignSelf: "center" }}>
              Sign in
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
