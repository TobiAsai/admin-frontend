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
    name: "", 
    state: "active" 
  });

  const navigate = useNavigate();

  const handleRegister = async () => {
    console.log("添加資料：", registerForm);
    const response = await api.post("/classification/create", registerForm);
    console.log("添加資料：", response.data);
    console.log("添加資料：", response.data.code);
    if (response.data.code === 200) {
      alert("添加成功！");
      navigate("/main/articleClassification");
      return
    }
    alert("添加失敗！");
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
            label="Name"
            value={registerForm.name}
            onChange={(e) =>
              setRegisterForm({ ...registerForm, name: e.target.value })
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
            註冊
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreatePage;