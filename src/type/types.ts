interface Article {
  id: number;
  title: string;
  content: string; // 內容欄位
  editor: string;  // 編輯者欄位
  classification: string;    // 分類欄位
  date: string;    // 日期欄位，通常是字串形式的日期
  view: number;    // 觀看數欄位
  state: string;   // 狀態欄位 (例如：草稿, 已發布, 已下架)
}


interface Classification {
  id: number;
  name: string;
  state: string; // 例如：active, inactive
}

interface Employee {
  id: number;
  username: string;
  password: string;
  state: string;
}

export type { Article, Classification, Employee };