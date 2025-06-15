import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../../api/axiosInstance";
import { Article, Classification } from "../../type/types";

import { Editor, Toolbar } from "@wangeditor/editor-for-react";
import "@wangeditor/editor/dist/css/style.css";

const ArticleTable = () => {
  const [data, setData] = useState<Article[]>([]);
  const [classificationList, setClassificationList] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  const [editor, setEditor] = useState<any>(null);

  const toolbarConfig = {};
  const editorConfig = { placeholder: "請輸入文章內容..." };

  const getData = async () => {
    try {
      const response = await api.get("/article/findAll", {
        params: {
          page,
          size: rowsPerPage,
          title: search,
        },
      });
      const pageData = response.data.data;
      setData(pageData.content);
      setTotalElements(pageData.totalElements);
    } catch (err) {
      console.error("載入員工資料失敗:", err);
    }
  };

  const getClassificationList = async () => {
    try {
      const response = await api.get("/classification/findAll");
      const classificationData = response.data.data;
      setClassificationList(
        classificationData.content.map((item: Classification) => item.name)
      );
    } catch (err) {
      console.error("載入分類資料失敗:", err);
    }
  };

  useEffect(() => {
    // 在當 componentDidMount 時執行
    getData(); // 呼叫 getData 函數
    getClassificationList(); // 呼叫 getClassificationList 函數
  }, []); // 在 componentDidMount 時執行

  useEffect(() => {
    getData();
  }, [page, rowsPerPage]);

  useEffect(() => {
    getData();
  }, [search]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (id: number) => {
    const response = await api.delete(`/article/delete/${id}`);
    if (response.status === 200) {
      console.log("刪除article資料成功:", response.data);
      getData();
      alert("刪除article資料成功"); // 刪除後可以呼叫 API 執行刪除操作
    } else {
      console.error("刪除article資料失敗:", response.data);
      alert("刪除article資料失敗"); // 刪除後可以呼叫 API 執行刪除操作
    }
  };

  const handleEditClick = (article: Article) => {
    setEditingArticle({ ...article });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingArticle(null);
    window.location.reload();
  };

  const handleEditFormChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setEditingArticle((prev) => {
      if (!prev) return null;
      const newValue =
        name === "password"
          ? (e as React.ChangeEvent<HTMLInputElement>).target.value
          : value;
      return { ...prev, [name]: newValue };
    });
  };

  const handleSaveEdit = async () => {
    if (editingArticle) {
      try {
        const response = await api.put(
          `/article/update/${editingArticle.id}`,
          editingArticle
        );
        if (response.status === 200) {
          getData();
          alert("更新成功！");
          handleCloseDialog();
        } else {
          alert("更新失敗，請稍後再試");
        }
      } catch (error) {
        console.error("更新失敗:", error);
        alert("更新過程中出錯");
      }
    }
    window.location.reload();
  };

  return (
    <Box p={4}>
      <Box
        mb={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <TextField
          variant="outlined"
          size="small"
          placeholder="搜尋 Title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Content</TableCell>
              <TableCell>Editor</TableCell>
              <TableCell>Classification</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>View</TableCell>
              <TableCell>State</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.title}</TableCell>
                <TableCell
                  sx={{
                    maxWidth: 200,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {row.content}
                </TableCell>{" "}
                {/* 內容欄位太長可能會爆掉，加個樣式 */}
                <TableCell>{row.editor}</TableCell>
                <TableCell>{row.classification}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.view}</TableCell>
                <TableCell>{row.state}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleEditClick(row)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(row.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 20, 50]}
          component="div"
          count={totalElements}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>編輯員工資料</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}
          >
            <TextField
              autoFocus
              margin="dense"
              name="title"
              label="Title"
              type="text"
              fullWidth
              variant="outlined"
              value={editingArticle?.title || ""}
              onChange={handleEditFormChange}
            />
            {/* <TextField
              margin="dense"
              name="content" // 🌟 新增 content 欄位 🌟
              label="Content"
              type="text"
              fullWidth
              multiline // 讓內容可以多行輸入
              rows={4} // 預設顯示 4 行
              variant="outlined"
              value={editingArticle?.content || ""}
              onChange={handleEditFormChange}
            /> */}
            <Box>
              <InputLabel>Content</InputLabel>
              <Toolbar
                editor={editor}
                defaultConfig={toolbarConfig}
                mode="default"
                style={{ borderBottom: "1px solid #ccc" }}
              />
              <Editor
                defaultConfig={editorConfig}
                value={editingArticle?.content || ""}
                onCreated={setEditor}
                onChange={(editor) => {
                  const html = editor.getHtml();
                  setEditingArticle((prev) =>
                    prev ? { ...prev, content: html } : null
                  );
                }}
                mode="default"
                style={{
                  height: "200px",
                  overflowY: "hidden",
                  border: "1px solid #ccc",
                }}
              />
            </Box>
            <TextField
              margin="dense"
              name="editor" // 🌟 新增 editor 欄位 🌟
              label="Editor"
              type="text"
              fullWidth
              variant="outlined"
              value={editingArticle?.editor || ""}
              onChange={handleEditFormChange}
            />
            {/* <TextField
              margin="dense"
              name="classification" // 🌟 新增 classification 欄位 🌟
              label="classification"
              type="text"
              fullWidth
              variant="outlined"
              value={editingArticle?.classification || ""}
              onChange={handleEditFormChange}
            /> */}
            <FormControl fullWidth margin="dense">
              <InputLabel id="classification-select-label">分類</InputLabel>
              <Select
                labelId="classification-select-label"
                name="classification"
                value={editingArticle?.classification || ""}
                label="分類"
                onChange={handleEditFormChange}
              >
                {/* <MenuItem value={"active"}>Active</MenuItem>
                <MenuItem value={"inactive"}>Inactive</MenuItem> */}
                {classificationList.map((item: string) => (
                  <MenuItem value={item}>{item}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              margin="dense"
              name="date" // 🌟 新增 date 欄位 🌟
              label="Date"
              type="date" // 使用 date 類型 input
              fullWidth
              variant="outlined"
              value={editingArticle?.date || ""}
              onChange={handleEditFormChange}
              InputLabelProps={{
                shrink: true, // 讓日期標籤一直浮起
              }}
            />
            <TextField
              margin="dense"
              name="view" // 🌟 新增 view 欄位 🌟
              label="View Count"
              type="number" // 觀看數是數字類型
              fullWidth
              variant="outlined"
              value={editingArticle?.view || 0} // 預設值為 0
              onChange={handleEditFormChange}
            />
            {/* 🌟 下拉選單區塊結束 🌟 */}
            <FormControl fullWidth margin="dense">
              <InputLabel id="state-select-label">狀態</InputLabel>
              <Select
                labelId="state-select-label"
                name="state"
                value={editingArticle?.state || ""}
                label="狀態"
                onChange={handleEditFormChange}
              >
                <MenuItem value={"active"}>Active</MenuItem>
                <MenuItem value={"inactive"}>Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            取消
          </Button>
          <Button onClick={handleSaveEdit} color="primary" variant="contained">
            儲存
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ArticleTable;
