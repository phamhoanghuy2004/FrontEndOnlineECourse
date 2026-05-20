import axiosClient from "./axiosClient";

export const placementTestApi = {
  startTest: () => {
    return axiosClient.post("/api/placement-test/start");
  },
  submitAnswer: (questionId, selectedAnswerId) => {
    return axiosClient.post("/api/placement-test/submit", {
      questionId,
      selectedAnswerId
    });
  }
};
