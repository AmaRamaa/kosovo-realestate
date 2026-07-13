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
  register: (data: any) => api.post('/auth/register', data),
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
  create: (data: any) => api.post('/listings', data),
  update: (id: string, data: any) => api.put(`/listings/${id}`, data),
  delete: (id: string) => api.delete(`/listings/${id}`),
  getFeatured: () => api.get('/listings/featured'),
  getRecent: (params?: any) => api.get('/listings/recent', { params }),
  getSimilar: (slug: string) => api.get(`/listings/${slug}/similar`),
  getMyListings: () => api.get('/listings/user/my-listings'),
  incrementView: (id: string) => api.post(`/listings/${id}/view`),
  approve: (id: string, status: string) => api.patch(`/listings/${id}/approve`, { status }),
};

export const agentApi = {
  getAll: (params?: any) => api.get('/agents', { params }),
  getById: (id: string) => api.get(`/agents/${id}`),
};

export const agencyApi = {
  getAll: () => api.get('/agencies'),
  getBySlug: (slug: string) => api.get(`/agencies/${slug}`),
};

export const cityApi = {
  getAll: () => api.get('/cities'),
  getBySlug: (slug: string) => api.get(`/cities/${slug}`),
};

export const favoriteApi = {
  getAll: () => api.get('/favorites'),
  add: (listingId: string) => api.post(`/favorites/${listingId}`),
  remove: (listingId: string) => api.delete(`/favorites/${listingId}`),
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

export const blogApi = {
  getAll: (params?: any) => api.get('/blog', { params }),
  getBySlug: (slug: string) => api.get(`/blog/${slug}`),
};

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getPendingListings: () => api.get('/admin/listings/pending'),
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  toggleUser: (id: string) => api.patch(`/admin/users/${id}/toggle`),
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
