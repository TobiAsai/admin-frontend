import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
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

  const [selectedIds, setSelectedIds] = useState<number[]>([]); // 新增：選中項目

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
      setSelectedIds([]); // 每次載入新資料時清空勾選
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
    getData();
    getClassificationList();
  }, []);

  useEffect(() => {
    getData();
  }, [page, rowsPerPage]);

  useEffect(() => {
    getData();
  }, [search]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("確定要刪除這筆文章嗎？")) return;
    try {
      const response = await api.delete(`/article/delete/${id}`);
      if (response.status === 200) {
        alert("刪除article資料成功");
        getData();
      } else {
        alert("刪除article資料失敗");
      }
    } catch (error) {
      console.error("刪除article資料失敗:", error);
      alert("刪除過程中發生錯誤");
    }
  };

  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) {
      alert("請先選擇要刪除的文章");
      return;
    }
    if (!window.confirm(`確定刪除選中的 ${selectedIds.length} 篇文章嗎？`)) {
      return;
    }
    try {
      const response = await api.delete("/article/deleteBatch", {
        data: selectedIds,
      });
      if (response.status === 200) {
        alert("批量刪除成功！");
        setSelectedIds([]);
        getData();
      } else {
        alert("批量刪除失敗");
      }
    } catch (error) {
      console.error("批量刪除錯誤:", error);
      alert("刪除過程發生錯誤");
    }
  };

  const handleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = data.map((article) => article.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
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
      return { ...prev, [name]: value };
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
          alert("更新成功！");
          getData();
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
        <Button
          variant="contained"
          color="error"
          disabled={selectedIds.length === 0}
          onClick={handleBatchDelete}
        >
          批量刪除
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedIds.length > 0 && selectedIds.length === data.length}
                  indeterminate={
                    selectedIds.length > 0 && selectedIds.length < data.length
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
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
              <TableRow key={row.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedIds.includes(row.id)}
                    onChange={() => handleSelect(row.id)}
                  />
                </TableCell>
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
                </TableCell>
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
              name="editor"
              label="Editor"
              type="text"
              fullWidth
              variant="outlined"
              value={editingArticle?.editor || ""}
              onChange={handleEditFormChange}
            />

            <FormControl fullWidth>
              <InputLabel id="classification-label">Classification</InputLabel>
              <Select
                labelId="classification-label"
                name="classification"
                value={editingArticle?.classification || ""}
                label="Classification"
                onChange={handleEditFormChange}
              >
                {classificationList.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              margin="dense"
              name="date"
              label="Date"
              type="date"
              fullWidth
              variant="outlined"
              value={editingArticle?.date || ""}
              onChange={handleEditFormChange}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              margin="dense"
              name="view"
              label="View"
              type="number"
              fullWidth
              variant="outlined"
              value={editingArticle?.view || ""}
              onChange={handleEditFormChange}
            />

            <TextField
              margin="dense"
              name="state"
              label="State"
              type="text"
              fullWidth
              variant="outlined"
              value={editingArticle?.state || ""}
              onChange={handleEditFormChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>取消</Button>
          <Button onClick={handleSaveEdit}>儲存</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ArticleTable;
