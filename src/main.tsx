// import * as React from 'react';
// import * as ReactDOM from 'react-dom/client';
// import { createBrowserRouter, RouterProvider } from 'react-router';
// import App from './App';
// import Layout from './layouts/dashboard';
// import DashboardPage from './pages';
// import LoginPage from './pages/auth/login';
// import RegisterPage from './pages/auth/register';
// import EmployelTabel from './pages/employee/employee';
// import ECreatePage from './pages/employee/create';
// import EModifyPage from './pages/employee/modify';
// import ClassificationTable from './pages/articleClassification/classification';
// import CCreatePage from './pages/articleClassification/create';
// import CModifyPage from './pages/articleClassification/modify';
// import ArticleTable from './pages/Article/article';
// import ACreatePage from './pages/Article/create';


// const router = createBrowserRouter([
//   {
//     Component: App,
//     children: [
//       {
//         path: '/main',
//         Component: Layout,
//         children: [
//           {
//             path: '',
//             Component: DashboardPage,
//           },
//           {
//             path: 'employee',
//             Component: EmployelTabel,
//           },
//           {
//             path: 'employee/create',
//             Component: ECreatePage,
//           },
//           {
//             path: 'employee/modify/:id',
//             Component: EModifyPage,
//           },
//           {
//             path: 'articleClassification',
//             Component: ClassificationTable,
//           },
//           {
//             path: 'articleClassification/create',
//             Component: CCreatePage,
//           },
//           {
//             path: 'articleClassification/modify/:id',
//             Component: CModifyPage,
//           },
//           {
//             path: 'article',
//             Component: ArticleTable,
//           },
//           {
//             path: 'article/create',
//             Component: ACreatePage,
//           },
//         ],
//       },
//       {
//         path: '/login',
//         Component: LoginPage,
//       },
//       {
//         path: '/register',
//         Component: RegisterPage,
//       }
//     ],
//   },
// ]);

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <RouterProvider router={router} />
//   </React.StrictMode>,
// );

import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, redirect } from 'react-router';
import App from './App';
import Layout from './layouts/dashboard';
import DashboardPage from './pages';
import LoginPage from './pages/auth/login';
import RegisterPage from './pages/auth/register';
import EmployelTabel from './pages/employee/employee';
import ECreatePage from './pages/employee/create';
import EModifyPage from './pages/employee/modify';
import ClassificationTable from './pages/articleClassification/classification';
import CCreatePage from './pages/articleClassification/create';
import CModifyPage from './pages/articleClassification/modify';
import ArticleTable from './pages/Article/article';
import ACreatePage from './pages/Article/create';
import { useNavigate } from 'react-router';

// const navigate = useNavigate();

// 驗證是否登入的簡單函式（可改成實際驗證 JWT）
const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

const requireAuth = ({ request }: { request: Request }) => {
  if (!isAuthenticated()) {
    return redirect('/login');
  }
  // navigate('/main');
  return null;
};

const router = createBrowserRouter([
  {
  path: '/',
  loader: () => {
    return localStorage.getItem('token')
      ? redirect('/main')
      : redirect('/login');
  },
},
  {
    Component: App,
    children: [
      {
        path: '/main',
        Component: Layout,
        loader: requireAuth, // 所有需要登入的頁面都在這個 layout 下面
        children: [
          { path: '', Component: DashboardPage },
          { path: 'employee', Component: EmployelTabel },
          { path: 'employee/create', Component: ECreatePage },
          { path: 'employee/modify/:id', Component: EModifyPage },
          { path: 'articleClassification', Component: ClassificationTable },
          { path: 'articleClassification/create', Component: CCreatePage },
          { path: 'articleClassification/modify/:id', Component: CModifyPage },
          { path: 'article', Component: ArticleTable },
          { path: 'article/create', Component: ACreatePage },
        ],
      },
      {
        path: '/login',
        Component: LoginPage,
      },
      {
        path: '/register',
        Component: RegisterPage,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);