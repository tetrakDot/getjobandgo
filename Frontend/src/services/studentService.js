import { apiClient } from './apiClient';

export async function listStudents(params) {
  const { data } = await apiClient.get('/students/', { params });
  return data;
}

export async function getStudent(id) {
  const { data } = await apiClient.get(`/students/${id}/`);
  return data;
}

export async function updateStudent(id, payload) {
  const { data } = await apiClient.patch(`/students/${id}/`, payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function downloadStudentResume(studentId) {
  const response = await apiClient.get(`/students/${studentId}/download-resume/`, {
    responseType: 'blob'
  });
  return response.data;
}
