import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';

import Dashboard from './pages/Dashboard';
import AddMilk from './pages/AddMilk';
import AddExpense from './pages/AddExpense';
import Withdraw from './pages/Withdraw'; // New
import Profile from './pages/Profile';   // New
import NotFound from './pages/NotFound'; // We'll create this briefly

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes (Wrapped in Layout) */}
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="add-milk" element={<AddMilk />} />
        <Route path="add-expense" element={<AddExpense />} />
        <Route path="withdraw" element={<Withdraw />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Catch All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
