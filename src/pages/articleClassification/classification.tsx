// // import React, { useState } from "react";
// // import {
// //   Box,
// //   Button,
// //   IconButton,
// //   Paper,
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TablePagination,
// //   TableRow,
// //   TextField,
// //   Typography,
// // } from "@mui/material";
// // import EditIcon from "@mui/icons-material/Edit";
// // import DeleteIcon from "@mui/icons-material/Delete";
// // import { Link } from "react-router";

// // interface Employee {
// //   id: number;
// //   name: string;
// //   state: string;
// // }

// // const ClassificationTable = () => {
// //   const initialData: Employee[] = [
// //     {
// //       id: 1,
// //       name: "Cartoon",
// //       state: "active",
// //     },
// //     {
// //       id: 2,
// //       name: "Vtuber",
// //       state: "active",
// //     },
// //   ];

// //   const [data, setData] = useState(initialData);
// //   const [search, setSearch] = useState("");
// //   const [page, setPage] = useState(0);
// //   const [rowsPerPage, setRowsPerPage] = useState(20);

// //   const filteredData: Employee[] = data.filter((row) =>
// //     row.name.toLowerCase().includes(search.toLowerCase())
// //   );

// //   const handleChangePage = (event, newPage) => {
// //     setPage(newPage);
// //   };

// //   const handleChangeRowsPerPage = (event) => {
// //     setRowsPerPage(parseInt(event.target.value, 10));
// //     setPage(0);
// //   };

// //   const handleDelete = (id) => {
// //     const updatedData = data.filter((row) => row.id !== id);
// //     setData(updatedData);
// //   };

// //   return (
// //     <Box p={4}>
// //       <Box
// //         mb={2}
// //         display="flex"
// //         justifyContent="space-between"
// //         alignItems="center"
// //       >
// //         <TextField
// //           variant="outlined"
// //           size="small"
// //           placeholder="搜尋 Name"
// //           value={search}
// //           onChange={(e) => setSearch(e.target.value)}
// //         />
// //       </Box>

// //       <TableContainer component={Paper}>
// //         <Table>
// //           <TableHead>
// //             <TableRow>
// //               <TableCell>ID</TableCell>
// //               <TableCell>Name</TableCell>
// //               <TableCell>State</TableCell>
// //               <TableCell align="center">Actions</TableCell>
// //             </TableRow>
// //           </TableHead>
// //           <TableBody>
// //             {filteredData
// //               .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
// //               .map((row) => (
// //                 <TableRow key={row.id}>
// //                   <TableCell>{row.id}</TableCell>
// //                   <TableCell>{row.name}</TableCell>
// //                   <TableCell>{row.state}</TableCell>
// //                   <TableCell align="center">
// //                     <IconButton>
// //                       <Link
// //                         to={`/main/articleClassification/modify/${row.id}`}
// //                       >
// //                         <EditIcon />
// //                       </Link>
// //                     </IconButton>
// //                     <IconButton onClick={() => handleDelete(row.id)}>
// //                       <DeleteIcon />
// //                     </IconButton>
// //                   </TableCell>
// //                 </TableRow>
// //               ))}
// //           </TableBody>
// //         </Table>
// //         <TablePagination
// //           rowsPerPageOptions={[10, 20, 50]}
// //           component="div"
// //           count={filteredData.length}
// //           rowsPerPage={rowsPerPage}
// //           page={page}
// //           onPageChange={handleChangePage}
// //           onRowsPerPageChange={handleChangeRowsPerPage}
// //         />
// //       </TableContainer>
// //     </Box>
// //   );
// // };

// // export default ClassificationTable;

// import React, { useState } from "react";
// import {
//   Box,
//   Button,
//   IconButton,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TablePagination,
//   TableRow,
//   TextField,
//   Typography,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
// } from "@mui/material";
// import type { SelectChangeEvent } from '@mui/material/Select'; // 引入 SelectChangeEvent 類型，用於處理 Select 元件的 onChange 事件
// import EditIcon from "@mui/icons-material/Edit"; // 編輯圖示
// import DeleteIcon from "@mui/icons-material/Delete"; // 刪除圖示

// // 定義 Employee 介面，規範資料結構
// interface Classification {
//   id: number;
//   name: string;
//   state: string; // 例如：active, inactive
// }

// /**
//  * ClassificationTable 元件
//  * 用於顯示和管理分類資料的表格，包含搜尋、分頁、編輯（彈出式視窗）和刪除功能。
//  */
// const ClassificationTable = () => {
//   // 初始分類資料
//   const initialData: Classification[] = [
//     {
//       id: 1,
//       name: "Cartoon",
//       state: "active",
//     },
//     {
//       id: 2,
//       name: "Vtuber",
//       state: "active",
//     },
//     {
//       id: 3,
//       name: "Gaming",
//       state: "inactive",
//     },
//   ];

//   // State Hook：儲存表格中的資料
//   const [data, setData] = useState(initialData);
//   // State Hook：儲存搜尋框的文字
//   const [search, setSearch] = useState("");
//   // State Hook：儲存當前分頁的頁碼 (從 0 開始)
//   const [page, setPage] = useState(0);
//   // State Hook：儲存每頁顯示的行數
//   const [rowsPerPage, setRowsPerPage] = useState(20);

//   // State Hook：控制編輯彈出式視窗的開啟/關閉
//   const [openDialog, setOpenDialog] = useState(false);
//   // State Hook：儲存目前正在編輯的 Classification 資料，或 null 如果沒有編輯中的項目
//   const [editingClassification, setEditingClassification] = useState<Classification | null>(null);

//   // 根據搜尋文字過濾資料
//   const filteredData: Classification[] = data.filter((row) =>
//     row.name.toLowerCase().includes(search.toLowerCase())
//   );

//   /**
//    * 處理分頁改變事件
//    * @param event - 事件物件
//    * @param newPage - 新的頁碼
//    */
//   const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
//     setPage(newPage);
//   };

//   /**
//    * 處理每頁顯示行數改變事件
//    * @param event - 事件物件，包含目標值 (新的每頁行數)
//    */
//   const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setRowsPerPage(parseInt(event.target.value, 10)); // 將字串轉換為數字
//     setPage(0); // 改變每頁行數後，重置到第一頁
//   };

//   /**
//    * 處理刪除按鈕點擊事件
//    * @param id - 要刪除的 Classification 的 ID
//    */
//   const handleDelete = (id: number) => {
//     // 過濾掉與指定 ID 相同的資料，更新 state
//     const updatedData = data.filter((row) => row.id !== id);
//     setData(updatedData);
//     // TODO: 實際應用中，這裡會呼叫 API 執行刪除操作
//   };

//   /**
//    * 處理編輯按鈕點擊事件，開啟彈出式視窗並設定編輯中的資料
//    * @param classification - 要編輯的 Employee 物件
//    */
//   const handleEditClick = (classification: Classification) => {
//     setEditingClassification({ ...classification }); // 複製一份資料到 editingEmployee，避免直接修改原始 data state
//     setOpenDialog(true); // 開啟編輯彈出式視窗
//   };

//   /**
//    * 處理彈出式視窗關閉事件
//    */
//   const handleCloseDialog = () => {
//     setOpenDialog(false); // 關閉彈出式視窗
//     setEditingClassification(null); // 清空編輯中的資料
//   };

//   /**
//    * 處理編輯表單中欄位的變更事件
//    * 適用於 TextField 和 Select 元件。
//    * @param e - 事件物件，其 target 包含 name 和 value 屬性
//    */
//   const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
//     const { name, value } = e.target; // 從事件目標中解構出 name 和 value
//     setEditingClassification((prev) => {
//       if (!prev) return null; // 如果 prev 不存在，則返回 null
//       return { ...prev, [name as string]: value }; // 更新 editingEmployee 中對應 name 的值
//     });
//   };

//   /**
//    * 處理儲存編輯後的資料
//    */
//   const handleSaveEdit = () => {
//     if (editingClassification) { // 確保有正在編輯的資料
//       // 遍歷目前的 data 陣列，如果 ID 符合，則替換為編輯後的資料
//       const updatedData = data.map((emp) =>
//         emp.id === editingClassification.id ? editingClassification : emp
//       );
//       setData(updatedData); // 更新資料 state
//       handleCloseDialog(); // 儲存後關閉視窗
//       // TODO: 實際應用中，這裡會呼叫 API 執行更新操作
//     }
//   };

//   return (
//     <Box p={4}>
//       {/* 搜尋框和新增按鈕區塊 */}
//       <Box
//         mb={2} // Margin-bottom
//         display="flex" // flex 佈局
//         justifyContent="space-between" // 子元素左右對齊
//         alignItems="center" // 子元素垂直居中
//       >
//         <TextField
//           variant="outlined" // 外框樣式
//           size="small" // 小尺寸
//           placeholder="搜尋 Name" // 提示文字
//           value={search} // 綁定搜尋框的值
//           onChange={(e) => setSearch(e.target.value)} // 搜尋框內容改變時更新 state
//         />
//         {/*
//           實際應用中，這裡可以添加一個新增按鈕
//           例如：<Button variant="contained" component={Link} to="/main/create">新增分類</Button>
//         */}
//       </Box>

//       {/* 表格容器 */}
//       <TableContainer component={Paper}>
//         <Table>
//           {/* 表頭 */}
//           <TableHead>
//             <TableRow>
//               <TableCell>ID</TableCell>
//               <TableCell>Name</TableCell>
//               <TableCell>State</TableCell>
//               <TableCell align="center">Actions</TableCell> {/* 操作按鈕欄位 */}
//             </TableRow>
//           </TableHead>
//           {/* 表格主體 */}
//           <TableBody>
//             {/* 根據過濾和分頁的資料渲染表格行 */}
//             {filteredData
//               .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // 根據分頁切片資料
//               .map((row) => (
//                 <TableRow key={row.id}> {/* 每個行都需要一個唯一的 key */}
//                   <TableCell>{row.id}</TableCell>
//                   <TableCell>{row.name}</TableCell>
//                   <TableCell>{row.state}</TableCell>
//                   <TableCell align="center">
//                     {/* 編輯按鈕：點擊後觸發 handleEditClick 開啟彈出式視窗 */}
//                     <IconButton onClick={() => handleEditClick(row)}>
//                       <EditIcon />
//                     </IconButton>
//                     {/* 刪除按鈕：點擊後觸發 handleDelete 刪除資料 */}
//                     <IconButton onClick={() => handleDelete(row.id)}>
//                       <DeleteIcon />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
//           </TableBody>
//         </Table>
//         {/* 表格分頁元件 */}
//         <TablePagination
//           rowsPerPageOptions={[10, 20, 50]} // 每頁可選行數選項
//           component="div" // 作為 div 元素渲染
//           count={filteredData.length} // 資料總數 (用於計算總頁數)
//           rowsPerPage={rowsPerPage} // 當前每頁顯示行數
//           page={page} // 當前頁碼
//           onPageChange={handleChangePage} // 頁碼改變時觸發
//           onRowsPerPageChange={handleChangeRowsPerPage} // 每頁行數改變時觸發
//         />
//       </TableContainer>

//       {/* 編輯分類資料的彈出式視窗 (Dialog) */}
//       <Dialog open={openDialog} onClose={handleCloseDialog}>
//         <DialogTitle>編輯分類</DialogTitle> {/* 彈出式視窗標題 */}
//         <DialogContent>
//           {/* 編輯表單內容 */}
//           <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
//             <TextField
//               autoFocus // 視窗開啟時自動聚焦
//               margin="dense" // 緊湊的邊距
//               name="name" // input 的 name 屬性，用於 handleEditFormChange 識別欄位
//               label="Name" // 標籤文字
//               type="text" // 輸入類型
//               fullWidth // 佔滿可用寬度
//               variant="outlined" // 外框樣式
//               value={editingClassification?.name || ""} // 綁定編輯中的 name 值，如果為 null 則顯示空字串
//               onChange={handleEditFormChange} // 值改變時觸發更新
//             />
//             {/* 狀態選擇下拉選單 */}
//             <FormControl fullWidth margin="dense">
//               <InputLabel id="state-select-label">狀態</InputLabel> {/* 下拉選單的標籤 */}
//               <Select
//                 labelId="state-select-label" // 綁定 InputLabel
//                 name="state" // Select 的 name 屬性
//                 value={editingClassification?.state || ""} // 綁定編輯中的 state 值
//                 label="狀態" // 當選中後，這個 label 會浮起來
//                 onChange={handleEditFormChange} // 值改變時觸發更新
//               >
//                 <MenuItem value={"active"}>Active</MenuItem> {/* 選項：啟用 */}
//                 <MenuItem value={"inactive"}>Inactive</MenuItem> {/* 選項：禁用 */}
//               </Select>
//             </FormControl>
//           </Box>
//         </DialogContent>
//         {/* 彈出式視窗的動作按鈕區塊 */}
//         <DialogActions>
//           <Button onClick={handleCloseDialog} color="primary">
//             取消
//           </Button>
//           <Button onClick={handleSaveEdit} color="primary" variant="contained">
//             儲存
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default ClassificationTable;
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
      console.log("刪除classification資料成功:", response.data);
      getData();
      alert("刪除classification資料成功"); // 刪除後可以呼叫 API 執行刪除操作
    } else {
      console.error("刪除classification資料失敗:", response.data);
      alert("刪除classification資料失敗"); // 刪除後可以呼叫 API 執行刪除操作
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
      const newValue =
        name === "password"
          ? (e as React.ChangeEvent<HTMLInputElement>).target.value
          : value;
      return { ...prev, [name]: newValue };
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
          getData();
          handleCloseDialog();
          alert("更新成功！");
        } else {
          alert("更新失敗，請稍後再試");
        }
      } catch (error) {
        console.error("更新失敗:", error);
        alert("更新過程中出錯");
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
      >
        <TextField
          variant="outlined"
          size="small"
          placeholder="搜尋 Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>State</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
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
              name="name"
              label="name"
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

export default ClassificationTable;
