// src/features/team/EmployeesPage.jsx
import React, { useState } from 'react';
import EmployeeList from './EmployeeList';
import AddEmployeeForm from './AddEmployeeForm';

const EmployeesPage = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Handle edit employee
  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setShowAddForm(true);
  };

  // Handle form close
  const handleFormClose = () => {
    setShowAddForm(false);
    setEditingEmployee(null);
    // Refresh the list
    setRefreshKey(prev => prev + 1);
  };

  // Handle form success
  const handleFormSuccess = () => {
    setShowAddForm(false);
    setEditingEmployee(null);
    // Refresh the list
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="employees-page">
      {showAddForm ? (
        <AddEmployeeForm 
          onCancel={handleFormClose}
          onSuccess={handleFormSuccess}
          editData={editingEmployee}
        />
      ) : (
        <EmployeeList 
          onAddClick={() => setShowAddForm(true)}
          onEditClick={handleEdit}
          refreshKey={refreshKey}
        />
      )}
    </div>
  );
};

export default EmployeesPage;