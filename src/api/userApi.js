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
  }
}

export default userApi;