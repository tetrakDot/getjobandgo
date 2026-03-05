import { apiClient } from './apiClient';

export async function applyToJob(jobId) {
  const { data } = await apiClient.post('/applications/', { job: jobId });
  return data;
}

export async function listMyApplications(params) {
  const { data } = await apiClient.get('/applications/', { params });
  return data;
}

export async function updateApplication(id, payload) {
  const { data } = await apiClient.patch(`/applications/${id}/`, payload);
  return data;
}

export async function downloadResume(applicationId) {
  const response = await apiClient.get(`/applications/${applicationId}/download-resume/`, {
    responseType: 'blob'
  });
  return response.data;
}
export async function getApplicationStats() {
  const { data } = await apiClient.get('/applications/stats/');
  return data;
}
