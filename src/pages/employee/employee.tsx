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
import type { SelectChangeEvent } from '@mui/material/Select';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../../api/axiosInstance";
import { Employee } from "../../type/types";

const EmployeeTable = () => {
  const [data, setData] = useState<Employee[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState("");

  // 新增選擇多筆 id 狀態
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const getData = async () => {
    try {
      const response = await api.get("/employee/findAll", {
        params: {
          page,
          size: rowsPerPage,
          username: search,
        },
      });
      const pageData = response.data.data;
      setData(pageData.content);
      setTotalElements(pageData.totalElements);
    } catch (err) {
      console.error("載入員工資料失敗:", err);
    }
  };

  useEffect(() => {
    getData();
    setSelectedIds([]); // 頁面改變或搜尋時清除勾選
  }, [page, rowsPerPage, search]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("確定刪除此員工資料嗎？")) return;
    try {
      const response = await api.delete(`/employee/delete/${id}`);
      if (response.status === 200) {
        alert("刪除員工資料成功");
        getData();
      }
    } catch (err) {
      console.error("刪除員工資料失敗:", err);
      alert("刪除失敗，請稍後再試");
    }
  };

  // 勾選全部
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = data.map((row) => row.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  // 勾選單筆
  const handleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // 批量刪除
  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`確定刪除 ${selectedIds.length} 筆員工資料嗎？`)) return;

    try {
      // axios delete 傳 body 用 data 欄位
      const response = await api.delete("/employee/deleteBatch", {
        data: selectedIds,
      });
      if (response.status === 200) {
        alert("批量刪除成功");
        setSelectedIds([]);
        getData();
      }
    } catch (err) {
      console.error("批量刪除失敗:", err);
      alert("刪除失敗，請稍後再試");
    }
  };

  const handleEditClick = (employee: Employee) => {
    setEditingEmployee({ ...employee });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingEmployee(null);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setEditingEmployee((prev) => {
      if (!prev) return null;
      const newValue = name === 'password' ? (e as React.ChangeEvent<HTMLInputElement>).target.value : value;
      return { ...prev, [name]: newValue };
    });
  };

  const handleSaveEdit = async () => {
    if (editingEmployee) {
      try {
        const response = await api.put(`/employee/update/${editingEmployee.id}`, editingEmployee);
        if (response.status === 200) {
          getData();
          handleCloseDialog();
          alert('更新成功！');
        } else {
          alert('更新失敗，請稍後再試');
        }
      } catch (error) {
        console.error('更新失敗:', error);
        alert('更新過程中出錯');
      }
    }
  };

  return (
    <Box p={4}>
      <Box
        mb={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
      >
        <TextField
          variant="outlined"
          size="small"
          placeholder="搜尋 Username"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedIds.length > 0 && selectedIds.length < data.length
                  }
                  checked={data.length > 0 && selectedIds.length === data.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Password</TableCell>
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
                    onChange={() => handleSelectOne(row.id)}
                  />
                </TableCell>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.username}</TableCell>
                <TableCell>{row.password}</TableCell>
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
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              name="username"
              label="Username"
              type="text"
              fullWidth
              variant="outlined"
              value={editingEmployee?.username || ""}
              onChange={handleEditFormChange}
            />
            <TextField
              margin="dense"
              name="password"
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              value={editingEmployee?.password || ""}
              onChange={handleEditFormChange}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="state-select-label">狀態</InputLabel>
              <Select
                labelId="state-select-label"
                name="state"
                value={editingEmployee?.state || ""}
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

export default EmployeeTable;
