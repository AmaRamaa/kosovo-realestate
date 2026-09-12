import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor - attach access token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
        const { accessToken } = data;
        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch {
        localStorage.removeItem('accessToken');
        window.location.href = '/auth/login';
      }
    }

    return Promise.reject(error);
  }
);

// Typed API methods
export const authApi = {
  login: (data: any) => api.post('/auth/login', data),
  googleAuth: (credential: string) => api.post('/auth/google', { credential }),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) => api.post('/auth/reset-password', { token, password }),
};

export const listingApi = {
  getAll: (params?: any) => api.get('/listings', { params }),
  getBySlug: (slug: string) => api.get(`/listings/${slug}`),
  getById: (id: string) => api.get(`/listings/id/${id}`),
  create: (data: any) => api.post('/listings', data),
  update: (id: string, data: any) => api.put(`/listings/${id}`, data),
  delete: (id: string) => api.delete(`/listings/${id}`),
  deleteImage: (id: string, imageId: string) => api.delete(`/listings/${id}/images/${imageId}`),
  getFeatured: () => api.get('/listings/featured'),
  getRecent: (params?: any) => api.get('/listings/recent', { params }),
  getSimilar: (slug: string) => api.get(`/listings/${slug}/similar`),
  incrementView: (id: string) => api.post(`/listings/${id}/view`),
  approve: (id: string, status: string) => api.patch(`/listings/${id}/approve`, { status }),
};

export const submissionApi = {
  submitListing: (data: any) => api.post('/submissions/listing', data),
  submitContact: (data: any) => api.post('/submissions/contact', data),
};

export const agentApi = {
  getAll: (params?: any) => api.get('/agents', { params }),
  getById: (id: string) => api.get(`/agents/${id}`),
};

export const cityApi = {
  getAll: () => api.get('/cities'),
  getBySlug: (slug: string) => api.get(`/cities/${slug}`),
};

export const messageApi = {
  getAll: () => api.get('/messages'),
  send: (data: any) => api.post('/messages', data),
  markRead: (id: string) => api.patch(`/messages/${id}/read`),
};

export const appointmentApi = {
  getAll: () => api.get('/appointments'),
  create: (data: any) => api.post('/appointments', data),
};

export const reviewApi = {
  getForAgent: (agentId: string) => api.get(`/reviews/agent/${agentId}`),
  create: (data: any) => api.post('/reviews', data),
};

export const analyticsApi = {
  track: (path: string, visitorId: string) => api.post('/analytics/track', { path, visitorId }),
  getStats: (days?: number) => api.get('/admin/analytics', { params: { days } }),
};

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getPendingListings: () => api.get('/admin/listings/pending'),
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  toggleUser: (id: string) => api.patch(`/admin/users/${id}/toggle`),
  getSubmissions: (params?: any) => api.get('/admin/submissions', { params }),
  updateSubmission: (id: string, status: string) => api.patch(`/admin/submissions/${id}`, { status }),
  deleteSubmission: (id: string) => api.delete(`/admin/submissions/${id}`),
  getCities: () => api.get('/admin/cities'),
  createCity: (data: any) => api.post('/admin/cities', data),
  updateCity: (id: string, data: any) => api.put(`/admin/cities/${id}`, data),
  deleteCity: (id: string) => api.delete(`/admin/cities/${id}`),
  createNeighborhood: (data: any) => api.post('/admin/neighborhoods', data),
  updateNeighborhood: (id: string, data: any) => api.put(`/admin/neighborhoods/${id}`, data),
  deleteNeighborhood: (id: string) => api.delete(`/admin/neighborhoods/${id}`),
  getAgents: () => api.get('/admin/agents'),
  createAgent: (data: any) => api.post('/admin/agents', data),
  updateAgent: (id: string, data: any) => api.put(`/admin/agents/${id}`, data),
  deleteAgent: (id: string) => api.delete(`/admin/agents/${id}`),
  getAppointments: (params?: any) => api.get('/admin/appointments', { params }),
  updateAppointment: (id: string, status: string) => api.patch(`/admin/appointments/${id}`, { status }),
  deleteAppointment: (id: string) => api.delete(`/admin/appointments/${id}`),
};

export const uploadApi = {
  uploadImages: (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    return api.post('/upload/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteImage: (publicId: string) => api.delete(`/upload/images/${publicId}`),
};

export const userApi = {
  updateProfile: (data: any) => api.put('/users/me', data),
  getNotifications: () => api.get('/users/me/notifications'),
  markNotificationsRead: () => api.patch('/users/me/notifications/read'),
  getRecentViews: () => api.get('/users/me/recent-views'),
};
