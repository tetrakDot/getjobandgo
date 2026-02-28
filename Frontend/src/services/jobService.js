import { apiClient } from './apiClient';

export async function listJobs(params) {
  const { data } = await apiClient.get('/jobs/', { params });
  return data;
}

export async function getJob(id) {
  const { data } = await apiClient.get(`/jobs/${id}/`);
  return data;
}

export async function createJob(payload) {
  const { data } = await apiClient.post('/jobs/', payload);
  return data;
}

export async function updateJob(id, payload) {
  const { data } = await apiClient.patch(`/jobs/${id}/`, payload);
  return data;
}

export async function deleteJob(id) {
  await apiClient.delete(`/jobs/${id}/`);
}

