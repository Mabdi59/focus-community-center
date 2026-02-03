import api from './api';

export const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

export const facilityService = {
  getPublicFacilities: async () => {
    const response = await api.get('/facilities/public');
    return response.data;
  },

  getFacilityById: async (id) => {
    const response = await api.get(`/facilities/public/${id}`);
    return response.data;
  },

  getAllFacilities: async () => {
    const response = await api.get('/facilities');
    return response.data;
  },

  createFacility: async (facilityData) => {
    const response = await api.post('/facilities', facilityData);
    return response.data;
  },

  updateFacility: async (id, facilityData) => {
    const response = await api.put(`/facilities/${id}`, facilityData);
    return response.data;
  },

  deleteFacility: async (id) => {
    const response = await api.delete(`/facilities/${id}`);
    return response.data;
  },
};

export const bookingService = {
  getMyBookings: async () => {
    const response = await api.get('/bookings/my');
    return response.data;
  },

  getAllBookings: async () => {
    const response = await api.get('/bookings');
    return response.data;
  },

  getBookingsByFacility: async (facilityId) => {
    const response = await api.get(`/bookings/facility/${facilityId}`);
    return response.data;
  },

  getBookingsByFacilityRange: async (facilityId, start, end) => {
    const response = await api.get(
      `/bookings/facility/${facilityId}/range?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`
    );
    return response.data;
  },

  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  updateBookingStatus: async (id, status) => {
    const response = await api.put(`/bookings/${id}/status?status=${status}`);
    return response.data;
  },

  deleteBooking: async (id) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  },
};
