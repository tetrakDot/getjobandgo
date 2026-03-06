import api from './api';

export const evaluatorService = {
  getEvaluations: () => api.get('2ex/logs/'),
  getEvaluationDetail: (id) => api.get(`2ex/logs/${id}/`),
  deleteEvaluation: (id) => api.delete(`2ex/logs/${id}/`),
  deleteAllEvaluations: () => api.delete('2ex/logs/'),
};

export default evaluatorService;
