import { apiClient } from './apiClient';

export async function listCompanies(params) {
  const { data } = await apiClient.get('/companies/', { params });
  return data;
}

export async function getCompany(id) {
  const { data } = await apiClient.get(`/companies/${id}/`);
  return data;
}

export async function updateCompany(id, payload) {
  const { data } = await apiClient.patch(`/companies/${id}/`, payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
