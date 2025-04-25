import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Projects API
export const projectsApi = {
  getAllProjects: () => api.get('/projects'),
  getProjectById: (id) => api.get(`/projects/${id}`),
  submitProject: (formData) => {
    return api.post('/projects/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getUserProjects: () => api.get('/projects/user'),
  rateProject: (projectId, rating) => api.post(`/projects/${projectId}/rate`, { rating }),
  likeProject: (projectId) => api.post(`/projects/${projectId}/like`),
  getProjectsBySDG: (sdg) => api.get(`/projects/sdg/${sdg}`),
};

// Collaborations API
export const collaborationsApi = {
  // Get all collaboration requests
  getAllCollaborations: (filters = {}) => api.get('/collaborations', { params: filters }),
  
  // Get collaboration by ID
  getCollaborationById: (id) => api.get(`/collaborations/${id}`),
  
  // Create a collaboration request
  createCollaboration: (data) => {
    // Get user ID from localStorage
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const userId = user._id;
    
    if (!userId) {
      console.error("No user ID found in localStorage");
      return Promise.reject(new Error("User ID is required"));
    }
    
    // Make sure createdBy is set correctly
    const formattedData = {
      ...data,
      createdBy: userId
    };
    
    return api.post('/collaborations/create', formattedData);
  },
  
  // Apply to a collaboration
  applyToCollaboration: (id, application) => {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    return api.post(`/collaborations/${id}/apply`, {
      ...application,
      userId: user._id
    });
  },
  
  // Get my created collaborations
  getMyCreatedCollaborations: () => {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    return api.get('/collaborations/my/created', { 
      params: { userId: user._id } 
    });
  },
  
  // Get my applications
  getMyApplications: () => {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    return api.get('/collaborations/my/applications', { 
      params: { userId: user._id } 
    });
  },
  
  // Close a collaboration request
  closeCollaboration: (id) => api.put(`/collaborations/${id}/close`),
  
  // Update application status
  updateApplicationStatus: (collaborationId, applicationId, status) => 
    api.put(`/collaborations/${collaborationId}/applications/${applicationId}`, { status }),
  
  // Request mentorship
  requestMentorship: (collaborationId, request) => {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    return api.post(`/collaborations/${collaborationId}/mentorship`, {
      ...request,
      userId: user._id
    });
  },
  
  // Respond to mentorship request
  respondToMentorshipRequest: (collaborationId, requestId, status, mentorMessage) => 
    api.put(`/collaborations/${collaborationId}/mentorship/${requestId}`, { status, mentorMessage }),
};

// User API
export const userApi = {
  login: (credentials) => api.post('/users/login', credentials),
  register: (userData) => api.post('/users/register', userData),
  getCurrentUser: () => api.get('/users/me'),
  updateProfile: (userData) => api.put('/users/profile', userData),
};

// GitHub Integration API - Add this to fix the error
export const githubApi = {
  verifyRepository: (repoUrl) => api.post('/github/verify', { repoUrl }),
  getRepositoryInfo: (repoUrl) => api.get(`/github/repository-info?url=${encodeURIComponent(repoUrl)}`),
  getCommitHistory: (repoUrl) => api.get(`/github/commits?url=${encodeURIComponent(repoUrl)}`),
  getLanguages: (repoUrl) => api.get(`/github/languages?url=${encodeURIComponent(repoUrl)}`),
  getContributors: (repoUrl) => api.get(`/github/contributors?url=${encodeURIComponent(repoUrl)}`),
};

export default api;