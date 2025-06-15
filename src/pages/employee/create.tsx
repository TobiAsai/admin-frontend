import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  FormControl, // 新增這個
  InputLabel,   // 新增這個
  Select,      // 新增這個
  MenuItem,    // 新增這個
} from "@mui/material";
import api from "../../api/axiosInstance";

const CreatePage = () => {
  const [registerForm, setRegisterForm] = useState({ 
    username: "", 
    password: "", 
    state: "active" // 🌟 新增一個 state 屬性來儲存選擇的州別 🌟
  });

  const navigate = useNavigate();

  const handleRegister = async () => {
    console.log("註冊資料：", registerForm);
    const response = await api.post("/employee/create", registerForm);
    console.log("註冊資料：", response.data);
    console.log("註冊資料：", response.data.code);
    if (response.data.code === 200) {
      alert("註冊成功！");
      navigate("/main/employee");
      return
    }
    alert("註冊失敗！");
    // TODO: 呼叫 API 註冊
  };

  return (
    <Container
      maxWidth="xs"
      sx={{ minHeight: "100vh" }}
    >
      <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
        <Typography variant="h6" mb={2}>
          Create
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

          {/* 🌟 這邊就是新增的下拉選單區塊囉！🌟 */}
          <FormControl fullWidth>
            <InputLabel id="state-select-label">state</InputLabel>
            <Select
              labelId="state-select-label"
              id="state-select"
              value={registerForm.state} // 綁定 state 的值
              label="state" // 這個 label 會在 Select 被選中後浮起來
              onChange={(e) =>
                setRegisterForm({ ...registerForm, state: e.target.value }) // 更新 state 的值
              }
            >
              <MenuItem value={"active"}>active</MenuItem>
              <MenuItem value={"inactive"}>inactive</MenuItem>
              {/* 當然你也可以再加更多選項喔！ */}
            </Select>
          </FormControl>
          {/* 🌟 下拉選單區塊結束 🌟 */}

          <Button variant="contained" onClick={handleRegister} fullWidth>
            新增
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreatePage;