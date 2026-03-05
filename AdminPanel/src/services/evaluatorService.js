import api from './api';

export const evaluatorService = {
  getEvaluations: () => api.get('evaluator/logs/'),
  getEvaluationDetail: (id) => api.get(`evaluator/logs/${id}/`),
  deleteEvaluation: (id) => api.delete(`evaluator/logs/${id}/`),
  deleteAllEvaluations: () => api.delete('evaluator/logs/'),
};

export default evaluatorService;
