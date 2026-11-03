import axiosInstance from './axiosInstance';

// جلب صور معرض مشروع معين
export const getProjectGallery = async (projectId) => {
    const response = await axiosInstance.get(`/ProjectImages/project/${projectId}`);
    return response.data;
};

// إضافة صورة جديدة لمعرض المشروع
export const addImageToGallery = async (imageData) => {
    const response = await axiosInstance.post('/ProjectImages', imageData);
    return response.data;
};

// حذف صورة من المعرض
export const deleteGalleryImage = async (imageId) => {
    const response = await axiosInstance.delete(`/ProjectImages/${imageId}`);
    return response.data;
};