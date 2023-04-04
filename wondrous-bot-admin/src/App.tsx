import { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DashboardPage from 'pages/dashboard';
import './App.css';
import CreatePage from 'pages/form/create';
import Layout from 'components/Layout';
import QuestsPage from 'pages/quests';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <DashboardPage />,
      },
      {
        path: '/members',
        element: <div>members</div>
      },
      {
        path: '/quests',
        element: <QuestsPage />
      },
      {
        path: '/levels',
        element: <div>levels</div>
      },
      {
        path: '/form/create',
        element: <CreatePage />,
      },
    ],
  },
]);

function App() {
  const [count, setCount] = useState(0);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
