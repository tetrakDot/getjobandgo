import { apiClient } from "./apiClient";

export const evaluateResume = async (jobDescription, resumeFile) => {
  const formData = new FormData();
  formData.append("job_description", jobDescription);
  formData.append("resume", resumeFile);

  console.log("2eX Request: /2ex/evaluate/", { jobDescription, resumeFile });
  const response = await apiClient.post("/2ex/evaluate/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
