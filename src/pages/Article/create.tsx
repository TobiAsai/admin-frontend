import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  FormControl, // 新增這個
  InputLabel, // 新增這個
  Select, // 新增這個
  MenuItem, // 新增這個
} from "@mui/material";
import api from "../../api/axiosInstance";
import { Classification } from "../../type/types";

const CreatePage = () => {
  const [registerForm, setRegisterForm] = useState({
    title: "",
    content: "",
    editor: "",
    classification: "",
    date: "",
    view: 0,
    state: "active",
  });
  const navigate = useNavigate();

  const [classificationList, setClassificationList] = useState<string[]>([]);

  useEffect(() => {
    getClassificationList();
  }, []);

  const getClassificationList = async () => {
    try {
      const response = await api.get("/classification/findAll");
      const classificationData = response.data.data;
      setClassificationList(classificationData.content.map((item: Classification) => item.name));
    } catch (err) {
      console.error("載入分類資料失敗:", err);
    }
  };

  const handleRegister = async () => {
    console.log("註冊資料：", registerForm);
    const response = await api.post("/article/create", registerForm);
    console.log("註冊資料：", response.data);
    console.log("註冊資料：", response.data.code);
    if (response.data.code === 200) {
      alert("註冊成功！");
      navigate("/main/article");
      return
    }
    // TODO: 呼叫 API 註冊
  };

  return (
    <Container maxWidth="xs" sx={{ minHeight: "100vh" }}>
      <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
        <Typography variant="h6" mb={2}>
          Create
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Content"
            value={registerForm.content}
            onChange={(e) =>
              setRegisterForm({ ...registerForm, content: e.target.value })
            }
            fullWidth
          />
          <TextField
            label="Editor"
            value={registerForm.editor}
            onChange={(e) =>
              setRegisterForm({ ...registerForm, editor: e.target.value })
            }
            fullWidth
          />
          <FormControl fullWidth margin="dense">
                        <InputLabel id="classification-select-label">分類</InputLabel>
                        <Select
                          labelId="classification-select-label"
                          name="classification"
                          value={registerForm.classification}
                          label="分類"
                          onChange={(e) =>
                            setRegisterForm({ ...registerForm, classification: e.target.value })
                          }
                        >
                          {/* <MenuItem value={"active"}>Active</MenuItem>
                          <MenuItem value={"inactive"}>Inactive</MenuItem> */}
                          {classificationList.map((item: string) => (
                            <MenuItem value={item}>{item}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
          <TextField
            label="Date"
            type="date"
            value={registerForm.date}
            onChange={(e) =>
              setRegisterForm({ ...registerForm, date: e.target.value })
            }
            fullWidth
            InputLabelProps={{ shrink: true }} // 讓 label 在日期輸入時也能正常顯示
          />

          <TextField
            label="Title"
            value={registerForm.title}
            onChange={(e) =>
              setRegisterForm({ ...registerForm, title: e.target.value })
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
              onChange={
                (e) =>
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
