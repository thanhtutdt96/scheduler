import { createBrowserRouter } from 'react-router-dom';
import MainLayout from 'layout/MainLayout';
import Home from 'pages/index';

const childrenRoutes = [
  {
    path: '/',
    element: <Home />,
  },
];

const routes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [...childrenRoutes],
  },
];

const router = createBrowserRouter(routes);

export default router;
