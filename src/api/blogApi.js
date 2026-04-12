import axiosClient from "./axiosClient";

const blogApi = {
    getAll: () => {
        return axiosClient.get('/blogs');
    },

    getMyBlogs: () => {
        return axiosClient.get('/blogs/my-blogs');
    },

    getById: (id) => {
        return axiosClient.get(`/blogs/${id}`);
    },

    create: (formData) => {
        return axiosClient.post('/blogs', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    update: (id, formData) => {
        return axiosClient.put(`/blogs/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    delete: (id) => {
        return axiosClient.delete(`/blogs/${id}`);
    }
};

export default blogApi;
