const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Helper to handle requests
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
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
