import * as React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import TableRowsIcon from '@mui/icons-material/TableRows';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import ClassIcon from '@mui/icons-material/Class';
import { Outlet } from 'react-router';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import type { Navigation } from '@toolpad/core/AppProvider';

import LogoutIcon from '@mui/icons-material/Logout';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router';

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'main',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'main/employee',
    title: 'Employee',
    icon: <PeopleIcon />,
    children: [
      {
        segment: '',
        title: 'EmployeeTable',
        icon: <TableRowsIcon />,
      },
      {
        segment: 'create',
        title: 'Create',
        icon: <AddIcon />,
      },
    ]
  },
  {
    segment: 'main/articleClassification',
    title: 'Article Classification',
    icon: <ClassIcon />,
    children: [
      {
        segment: '',
        title: 'ClassificationTable',
        icon: <TableRowsIcon />,
      },
      {
        segment: 'create',
        title: 'Create',
        icon: <AddIcon />,
      },
    ]
  },
  {
    segment: 'main/article',
    title: 'Article',
    icon: <DescriptionIcon />,
    children: [
      {
        segment: '',
        title: 'ArticleTable',
        icon: <TableRowsIcon />,
      },
      {
        segment: 'create',
        title: 'Create',
        icon: <AddIcon />,
      },
    ]
  }
];

const BRANDING = {
  title: 'Back-office management system',
};

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // 移除 JWT
    navigate('/login'); // 回到登入頁面
  };

  return (
    <Button
      startIcon={<LogoutIcon />}
      color="error"
      onClick={handleLogout}
      sx={{ position: 'fixed', bottom: 16, right: 16 }}
    >
      Logout
    </Button>
  );
}

export default function App() {
  return (
    <ReactRouterAppProvider navigation={NAVIGATION} branding={BRANDING}>
      <Outlet />
      <LogoutButton />
    </ReactRouterAppProvider>
  );
}
