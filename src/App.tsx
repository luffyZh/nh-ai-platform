import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import IdeaDashboardPage from './pages/IdeaDashboardPage';
import IdeaListPage from './pages/IdeaListPage';
import IdeaWizardPage from './pages/IdeaWizardPage';
import IdeaPrdPage from './pages/IdeaPrdPage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import WeeklyReportPage from './pages/WeeklyReportPage';
import UserManagementPage from './pages/UserManagementPage';
import DepartmentManagementPage from './pages/DepartmentManagementPage';
import PermissionManagementPage from './pages/PermissionManagementPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<IdeaDashboardPage />} />
        <Route path="/ideas" element={<IdeaListPage />} />
        <Route path="/ideas/:id/wizard" element={<IdeaWizardPage />} />
        <Route path="/ideas/:id/prd" element={<IdeaPrdPage />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/reports" element={<WeeklyReportPage />} />
        <Route path="/departments" element={<DepartmentManagementPage />} />
        <Route path="/users" element={<UserManagementPage />} />
        <Route path="/permissions" element={<PermissionManagementPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
