import axiosClient from "./axiosClient";


const userApi = {

  googleLoginApi: (data) => {
    return axiosClient.post('/auth/google-login', data);
  },


  completeProfileApi: (data) => {
    return axiosClient.put('/users/complete-profile', data);
  },


  getStudentInfoApi: () => {
    return axiosClient.get('/students/my-profile');
  },

  getAdminInfoApi: () => {
    return axiosClient.get('/admins/my-profile');
  },

  getTeacherInfoApi: () => {
    return axiosClient.get('/teachers/my-profile');
  },

  createStudyGoal: (data) => {
    return axiosClient.post('/students/study-goals', data)
  },

  updateStudyGoal: (data, id) => {
    return axiosClient.put(`/students/study-goals/${id}`, data)
  },

  updateUser: (formData) => {
    const url = '/users';
    return axiosClient.put(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  updateTeacherProfile: (data) => {
    return axiosClient.put('/teachers/profile', data);
  },

  getStudentStatisticsApi: (params) => {
    return axiosClient.get('/teachers/student-statistics', { params });
  },

  getAllTeachersApi: () => {
    return axiosClient.get('/teachers/all');
  },

}

export default userApi;