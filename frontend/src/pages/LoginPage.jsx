// src/pages/LoginPage.jsx
import React from 'react';
import LoginForm from '../components/LoginForm';
import './LoginPage.css';

const LoginPage = () => {
  return (
    <div className="page-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your account to continue</p>
        </div>
        <LoginForm />
        <div className="login-footer">
          <p>© 2026 Payroll System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;