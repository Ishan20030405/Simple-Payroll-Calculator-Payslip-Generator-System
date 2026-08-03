// src/App.jsx - With Nested Routes
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/DashboardLayout';
import EmployeeDashboard from './components/EmployeeDashboard';
import EmployeesPage from './features/team/EmployeesPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            {/* ✅ Dashboard Layout with Nested Routes */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<div>Dashboard Content</div>} />
              <Route path="employees" element={<EmployeesPage />} />
              <Route path="payroll" element={<div>Payroll Content</div>} />
              <Route path="payslips" element={<div>Payslips Content</div>} />
              <Route path="reports" element={<div>Reports Content</div>} />
            </Route>
            
            {/* Employee Routes */}
            <Route 
              path="/employee-dashboard" 
              element={
                <ProtectedRoute>
                  <EmployeeDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;