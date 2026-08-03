// src/components/EmployeePayslip.jsx
import React, { useState } from 'react';
import { Download, Printer, Calendar, Search, ChevronDown, FileText } from 'lucide-react';

const EmployeePayslip = ({ employee }) => {
  const [selectedMonth, setSelectedMonth] = useState('2026-05');
  const [payslipData, setPayslipData] = useState(null);

  // Sample payslip data
  const samplePayslip = {
    month: 'May 2026',
    employeeName: 'Nimal Perera',
    employeeId: 'E001',
    designation: 'Manager',
    department: 'Administration',
    earnings: [
      { description: 'Basic Salary', amount: 80000 },
      { description: 'Housing Allowance', amount: 10000 },
      { description: 'Transport Allowance', amount: 6000 },
      { description: 'Meal Allowance', amount: 4000 },
    ],
    deductions: [
      { description: 'EPF (8%)', amount: 8000 },
      { description: 'ETF (3%)', amount: 3000 },
      { description: 'Tax (PAYE)', amount: 13500 },
    ],
    netPay: 75500,
    grossPay: 100000,
    amountInWords: 'Seventy Five Thousand Five Hundred Only'
  };

  // Load payslip on month change
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    // In production, fetch from API
    setPayslipData(samplePayslip);
  };

  // Available months
  const availableMonths = [
    '2026-05', '2026-04', '2026-03', '2026-02', '2026-01',
    '2025-12', '2025-11', '2025-10'
  ];

  const formatMonth = (month) => {
    const [year, monthNum] = month.split('-');
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    return `${monthNames[parseInt(monthNum) - 1]} ${year}`;
  };

  return (
    <div className="employee-payslip">
      {/* Payslip Controls */}
      <div className="payslip-controls">
        <div className="month-selector">
          <label><Calendar size={16} /> Select Month</label>
          <div className="select-wrapper">
            <select value={selectedMonth} onChange={handleMonthChange}>
              {availableMonths.map((month) => (
                <option key={month} value={month}>
                  {formatMonth(month)}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="select-icon" />
          </div>
        </div>
        <div className="payslip-actions">
          <button className="action-btn-outline">
            <Download size={16} /> Download PDF
          </button>
          <button className="action-btn-outline">
            <Printer size={16} /> Print
          </button>
        </div>
      </div>

      {/* Payslip Preview */}
      {payslipData ? (
        <div className="payslip-preview">
          <div className="payslip-header">
            <h2>ABC (Pvt) Ltd</h2>
            <p className="company-address">123, Main Street, Colombo 07</p>
            <p className="company-phone">Tel: 011 234 5678</p>
            <h3 className="payslip-title">PAYSLIP - {payslipData.month}</h3>
          </div>

          <div className="payslip-employee-info">
            <div className="info-row">
              <span><strong>Employee ID:</strong> {payslipData.employeeId}</span>
              <span><strong>Employee Name:</strong> {payslipData.employeeName}</span>
            </div>
            <div className="info-row">
              <span><strong>Designation:</strong> {payslipData.designation}</span>
              <span><strong>Department:</strong> {payslipData.department}</span>
            </div>
          </div>

          <div className="payslip-table-container">
            <div className="payslip-table">
              <h4 className="table-title earnings">EARNINGS</h4>
              <table>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th className="text-right">Amount (Rs.)</th>
                  </tr>
                </thead>
                <tbody>
                  {payslipData.earnings.map((item, index) => (
                    <tr key={index}>
                      <td>{item.description}</td>
                      <td className="text-right">{item.amount.toLocaleString()}.00</td>
                    </tr>
                  ))}
                  <tr className="total-row success">
                    <td><strong>Total Earnings</strong></td>
                    <td className="text-right">
                      <strong>{payslipData.grossPay.toLocaleString()}.00</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="payslip-table">
              <h4 className="table-title deductions">DEDUCTIONS</h4>
              <table>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th className="text-right">Amount (Rs.)</th>
                  </tr>
                </thead>
                <tbody>
                  {payslipData.deductions.map((item, index) => (
                    <tr key={index}>
                      <td>{item.description}</td>
                      <td className="text-right">{item.amount.toLocaleString()}.00</td>
                    </tr>
                  ))}
                  <tr className="total-row danger">
                    <td><strong>Total Deductions</strong></td>
                    <td className="text-right">
                      <strong>
                        {payslipData.deductions.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}.00
                      </strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Net Pay */}
          <div className="net-pay-section">
            <div className="net-pay-box">
              <div className="net-pay-left">
                <h5>NET PAY</h5>
                <h2>Rs. {payslipData.netPay.toLocaleString()}.00</h2>
              </div>
              <div className="net-pay-right">
                <h6>Amount in Words:</h6>
                <p className="amount-words">{payslipData.amountInWords}</p>
              </div>
            </div>
          </div>

          <div className="payslip-footer">
            <p>Payer: {payslipData.month} - {payslipData.employeeName} ({payslipData.employeeId})</p>
            <p className="generated-date">Generated on: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      ) : (
        <div className="no-payslip">
          <FileText size={48} className="no-data-icon" />
          <p>Select a month to view your payslip</p>
        </div>
      )}
    </div>
  );
};

export default EmployeePayslip;