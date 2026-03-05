import { apiClient } from './apiClient';

export async function login(email, password) {
  const { data } = await apiClient.post('/auth/login/', { email, password });
  return data;
}

export async function refreshToken(refresh) {
  const { data } = await apiClient.post('/auth/token/refresh/', { refresh });
  return data;
}

export async function registerStudent(payload) {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });
  const { data } = await apiClient.post('/students/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
}

export async function registerCompany(payload) {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });
  const { data } = await apiClient.post('/companies/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
}

export async function logout() {
  const { data } = await apiClient.post('/auth/logout/');
  return data;
}

export async function forgotPassword(email) {
  const { data } = await apiClient.post('/auth/forgot-password/', { email });
  return data;
}

export async function verifyOTP(email, otp) {
  const { data } = await apiClient.post('/auth/verify-otp/', { email, otp });
  return data;
}

export async function resetPassword(email, otp, new_password) {
  const { data } = await apiClient.post('/auth/reset-password/', { email, otp, new_password });
  return data;
}



