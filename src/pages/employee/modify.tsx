import React, { useState } from "react";
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

const ModifyPage = () => {
  const [registerForm, setRegisterForm] = useState({ 
    username: "", 
    password: "", 
    state: "0"
  });

  const handleRegister = () => {
    console.log("註冊資料：", registerForm);
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
            placeholder={registerForm.username}
            onChange={(e) =>
              setRegisterForm({ ...registerForm, username: e.target.value })
            }
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={registerForm.password}
            placeholder={registerForm.password}
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
              <MenuItem value={"1"}>active</MenuItem>
              <MenuItem value={"0"}>inactive</MenuItem>
              {/* 當然你也可以再加更多選項喔！ */}
            </Select>
          </FormControl>
          {/* 🌟 下拉選單區塊結束 🌟 */}

          <Button variant="contained" onClick={handleRegister} fullWidth>
            註冊
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ModifyPage;