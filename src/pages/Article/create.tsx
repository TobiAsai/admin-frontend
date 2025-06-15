// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router";
// import {
//   Box,
//   Button,
//   Container,
//   TextField,
//   Typography,
//   Paper,
//   FormControl, // 新增這個
//   InputLabel, // 新增這個
//   Select, // 新增這個
//   MenuItem, // 新增這個
// } from "@mui/material";
// import api from "../../api/axiosInstance";
// import { Classification } from "../../type/types";

// const CreatePage = () => {
//   const [registerForm, setRegisterForm] = useState({
//     title: "",
//     content: "",
//     editor: "",
//     classification: "",
//     date: "",
//     view: 0,
//     state: "active",
//   });
//   const navigate = useNavigate();

//   const [classificationList, setClassificationList] = useState<string[]>([]);

//   useEffect(() => {
//     getClassificationList();
//   }, []);

//   const getClassificationList = async () => {
//     try {
//       const response = await api.get("/classification/findAll");
//       const classificationData = response.data.data;
//       setClassificationList(classificationData.content.map((item: Classification) => item.name));
//     } catch (err) {
//       console.error("載入分類資料失敗:", err);
//     }
//   };

//   const handleRegister = async () => {
//     console.log("註冊資料：", registerForm);
//     const response = await api.post("/article/create", registerForm);
//     console.log("註冊資料：", response.data);
//     console.log("註冊資料：", response.data.code);
//     if (response.data.code === 200) {
//       alert("註冊成功！");
//       navigate("/main/article");
//       return
//     }
//     // TODO: 呼叫 API 註冊
//   };

//   return (
//     <Container maxWidth="xs" sx={{ minHeight: "100vh" }}>
//       <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
//         <Typography variant="h6" mb={2}>
//           Create
//         </Typography>
//         <Box display="flex" flexDirection="column" gap={2}>
//           <TextField
//             label="Content"
//             value={registerForm.content}
//             onChange={(e) =>
//               setRegisterForm({ ...registerForm, content: e.target.value })
//             }
//             fullWidth
//           />
//           <TextField
//             label="Editor"
//             value={registerForm.editor}
//             onChange={(e) =>
//               setRegisterForm({ ...registerForm, editor: e.target.value })
//             }
//             fullWidth
//           />
//           <FormControl fullWidth margin="dense">
//                         <InputLabel id="classification-select-label">分類</InputLabel>
//                         <Select
//                           labelId="classification-select-label"
//                           name="classification"
//                           value={registerForm.classification}
//                           label="分類"
//                           onChange={(e) =>
//                             setRegisterForm({ ...registerForm, classification: e.target.value })
//                           }
//                         >
//                           {/* <MenuItem value={"active"}>Active</MenuItem>
//                           <MenuItem value={"inactive"}>Inactive</MenuItem> */}
//                           {classificationList.map((item: string) => (
//                             <MenuItem value={item}>{item}</MenuItem>
//                           ))}
//                         </Select>
//                       </FormControl>
//           <TextField
//             label="Date"
//             type="date"
//             value={registerForm.date}
//             onChange={(e) =>
//               setRegisterForm({ ...registerForm, date: e.target.value })
//             }
//             fullWidth
//             InputLabelProps={{ shrink: true }} // 讓 label 在日期輸入時也能正常顯示
//           />

//           <TextField
//             label="Title"
//             value={registerForm.title}
//             onChange={(e) =>
//               setRegisterForm({ ...registerForm, title: e.target.value })
//             }
//             fullWidth
//           />

//           {/* 🌟 這邊就是新增的下拉選單區塊囉！🌟 */}
//           <FormControl fullWidth>
//             <InputLabel id="state-select-label">state</InputLabel>
//             <Select
//               labelId="state-select-label"
//               id="state-select"
//               value={registerForm.state} // 綁定 state 的值
//               label="state" // 這個 label 會在 Select 被選中後浮起來
//               onChange={
//                 (e) =>
//                   setRegisterForm({ ...registerForm, state: e.target.value }) // 更新 state 的值
//               }
//             >
//               <MenuItem value={"active"}>active</MenuItem>
//               <MenuItem value={"inactive"}>inactive</MenuItem>
//               {/* 當然你也可以再加更多選項喔！ */}
//             </Select>
//           </FormControl>
//           {/* 🌟 下拉選單區塊結束 🌟 */}

//           <Button variant="contained" onClick={handleRegister} fullWidth>
//             註冊
//           </Button>
//         </Box>
//       </Paper>
//     </Container>
//   );
// };

// export default CreatePage;

import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import api from "../../api/axiosInstance";
import { Classification } from "../../type/types";

import "@wangeditor/editor/dist/css/style.css"; // 必須引入樣式
import {  Editor, Toolbar } from "@wangeditor/editor-for-react";
import { IDomEditor, IEditorConfig, IToolbarConfig } from "@wangeditor/editor";

const CreatePage = () => {
  const [registerForm, setRegisterForm] = useState({
    title: "",
    content: "", // 富文本內容將存在這裡
    editor: "",
    classification: "",
    date: "",
    view: 0,
    state: "active",
  });
  const [editor, setEditor] = useState<IDomEditor | null>(null);
  const navigate = useNavigate();

  const [classificationList, setClassificationList] = useState<string[]>([]);

  useEffect(() => {
    getClassificationList();
    return () => {
      if (editor) editor.destroy();
    };
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

  const toolbarConfig: Partial<IToolbarConfig> = {};
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: "請輸入內容...",
    MENU_CONF: {},
  };

  const handleRegister = async () => {
    console.log("添加資料：", registerForm);
    const response = await api.post("/article/create", registerForm);
    if (response.data.code === 200) {
      alert("添加成功！");
      navigate("/main/article");
    }
    alert("添加失敗！");
  };

  return (
    <Container maxWidth="md" sx={{ minHeight: "100vh" }}>
      <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
        <Typography variant="h6" mb={2}>
          Create
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Title"
            value={registerForm.title}
            onChange={(e) => setRegisterForm({ ...registerForm, title: e.target.value })}
            fullWidth
          />
          <TextField
            label="Editor"
            value={registerForm.editor}
            onChange={(e) => setRegisterForm({ ...registerForm, editor: e.target.value })}
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
              {classificationList.map((item: string, index) => (
                <MenuItem key={index} value={item}>{item}</MenuItem>
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
            InputLabelProps={{ shrink: true }}
          />

          {/* 富文本編輯器區塊 */}
          <Box>
            <Typography variant="subtitle1" mb={1}>
              Content
            </Typography>
            <Toolbar editor={editor} defaultConfig={toolbarConfig} mode="default" style={{ borderBottom: '1px solid #ccc' }} />
            <Editor
              defaultConfig={editorConfig}
              value={registerForm.content}
              onCreated={setEditor}
              onChange={(editor: any) => {
                setRegisterForm({ ...registerForm, content: editor.getHtml() });
              }}
              mode="default"
              style={{ height: "300px", overflowY: "auto", border: "1px solid #ccc", padding: "8px" }}
            />
          </Box>

          <FormControl fullWidth>
            <InputLabel id="state-select-label">state</InputLabel>
            <Select
              labelId="state-select-label"
              id="state-select"
              value={registerForm.state}
              label="state"
              onChange={(e) =>
                setRegisterForm({ ...registerForm, state: e.target.value })
              }
            >
              <MenuItem value={"active"}>active</MenuItem>
              <MenuItem value={"inactive"}>inactive</MenuItem>
            </Select>
          </FormControl>

          <Button variant="contained" onClick={handleRegister} fullWidth>
            註冊
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreatePage;