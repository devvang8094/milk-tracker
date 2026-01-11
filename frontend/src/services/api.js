import { API_BASE_URL } from '../config/api';

// Helper to handle requests
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  // Construct URL with /api prefix as per instructions
  // endpoint normally starts with / (e.g. /auth/login)
  const url = `${API_BASE_URL}/api${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Something went wrong');
  }

  // Handle empty responses (e.g., 204 No Content) or verify if valid JSON
  const text = await response.text();
  return text ? JSON.parse(text) : {};
}

// AUTH
export async function signupUser(phoneNumber, password) {
  return request('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ phoneNumber, password }),
  });
}

export async function loginUser(phoneNumber, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ phoneNumber, password }),
  });
}

// DASHBOARD
export async function getDashboardStats() {
  return request('/dashboard/stats');
}

// MILK RECORDS
export async function addMilkRecord(data) {
  return request('/milk-records', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getMilkRecords() {
  return request('/milk-records');
}

export async function updateMilkRecord(id, data) {
  return request(`/milk-records/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteMilkRecord(id) {
  return request(`/milk-records/${id}`, {
    method: 'DELETE',
  });
}

// EXPENSES
export async function addExpense(data) {
  return request('/expenses', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getExpenses() {
  return request('/expenses');
}

export async function updateExpense(id, data) {
  return request(`/expenses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteExpense(id) {
  return request(`/expenses/${id}`, {
    method: 'DELETE',
  });
}

// WITHDRAWALS
export async function addWithdrawal(data) {
  return request('/withdrawals', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getWithdrawals() {
  return request('/withdrawals');
}

export async function updateWithdrawal(id, data) {
  return request(`/withdrawals/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteWithdrawal(id) {
  return request(`/withdrawals/${id}`, {
    method: 'DELETE',
  });
}

// FAT PRICE / RATE
export async function getFatPrice() {
  return request('/fat-rate');
}

export async function updateFatPrice(price) {
  return request('/fat-rate', {
    method: 'PUT',
    body: JSON.stringify({ ratePerFat: price }),
  });
}

// HISTORY (New)
export async function fetchEarningsHistory() {
  return request('/history/earnings');
}

export async function fetchExpensesHistory() {
  return request('/history/expenses');
}

export async function fetchWithdrawalsHistory() {
  return request('/history/withdrawals');
}
