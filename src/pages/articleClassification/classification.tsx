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
import { Classification } from "../../type/types";

const ClassificationTable = () => {
  const [data, setData] = useState<Classification[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [editingClassification, setEditingClassification] =
    useState<Classification | null>(null);

  // 新增：批量選中id清單
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const getData = async () => {
    try {
      const response = await api.get("/classification/findAll", {
        params: {
          page,
          size: rowsPerPage,
          name: search,
        },
      });
      const pageData = response.data.data;
      setData(pageData.content);
      setTotalElements(pageData.totalElements);
      setSelectedIds([]); // 每次讀取資料後清空選取
    } catch (err) {
      console.error("載入classification資料失敗:", err);
    }
  };

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
    const response = await api.delete(`/classification/delete/${id}`);
    if (response.status === 200) {
      alert("刪除classification資料成功");
      getData();
    } else {
      alert("刪除classification資料失敗");
    }
  };

  // 新增：批量刪除
  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) {
      alert("請先選擇至少一筆資料");
      return;
    }

    if (!window.confirm(`確定刪除選中的 ${selectedIds.length} 筆資料嗎？`)) {
      return;
    }

    try {
      const response = await api.delete("/classification/deleteBatch", {
        data: selectedIds,
      });
      if (response.status === 200) {
        alert("批量刪除成功！");
        getData();
      } else {
        alert("批量刪除失敗");
      }
    } catch (error) {
      console.error("批量刪除失敗:", error);
      alert("刪除過程出錯");
    }
  };

  const handleEditClick = (classification: Classification) => {
    setEditingClassification({ ...classification });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingClassification(null);
  };

  const handleEditFormChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setEditingClassification((prev) => {
      if (!prev) return null;
      return { ...prev, [name]: value };
    });
  };

  const handleSaveEdit = async () => {
    if (editingClassification) {
      try {
        const response = await api.put(
          `/classification/update/${editingClassification.id}`,
          editingClassification
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
  };

  // 新增：單筆選中/取消選中
  const handleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // 新增：全選/取消全選
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedIds(data.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  // 判斷是否全選
  const isAllSelected = data.length > 0 && selectedIds.length === data.length;

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
          placeholder="搜尋 Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 200 }}
        />
        {/* 新增：批量刪除按鈕 */}
        <Button
          variant="contained"
          color="error"
          onClick={handleBatchDelete}
          disabled={selectedIds.length === 0}
        >
          批量刪除
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {/* 新增：全選 Checkbox */}
              <TableCell padding="checkbox">
                <Checkbox
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  inputProps={{ "aria-label": "select all classifications" }}
                />
              </TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>State</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => {
              const isSelected = selectedIds.includes(row.id);
              return (
                <TableRow
                  key={row.id}
                  hover
                  role="checkbox"
                  aria-checked={isSelected}
                  selected={isSelected}
                >
                  {/* 新增：單筆 Checkbox */}
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={() => handleSelect(row.id)}
                      inputProps={{ "aria-labelledby": `checkbox-${row.id}` }}
                    />
                  </TableCell>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
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
              );
            })}
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
        <DialogTitle>編輯分類資料</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}
          >
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Name"
              type="text"
              fullWidth
              variant="outlined"
              value={editingClassification?.name || ""}
              onChange={handleEditFormChange}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="state-select-label">狀態</InputLabel>
              <Select
                labelId="state-select-label"
                name="state"
                value={editingClassification?.state || ""}
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
          <Button onClick={handleCloseDialog}>取消</Button>
          <Button onClick={handleSaveEdit} variant="contained">
            儲存
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClassificationTable;
