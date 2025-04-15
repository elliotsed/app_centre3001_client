import axios from 'axios';

const API_BASE_URL = 'https://app-centre3001-api.vercel.app/gestion_contact';
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

// --- Clients ---
export const fetchClients = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/clients`);
    return response.data;
  } catch (error) {
    console.error('Error fetching clients:', error);
    return error;
  }
};

export const fetchClient = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/clients/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching client:', error);
    return error;
  }
};

export const createClient = async (clientData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/add-client`, clientData);
    return response.data;
  } catch (error) {
    console.error('Error creating client:', error);
    return error;
  }
};

export const updateClient = async (clientId, updatedData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/update-client/${clientId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating client:', error);
    return error;
  }
};

export const deleteClient = async (clientId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/client/${clientId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting client:', error);
    return error;
  }
};

// --- Consultations ---
export const fetchConsultations = async (clientId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/consultations/${clientId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching consultations:', error);
    return error;
  }
};

export const fetchConsultation = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/consultation/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching consultation:', error);
    return error;
  }
};

export const createConsultation = async (consultationData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/add-consultation`, consultationData);
    return response.data;
  } catch (error) {
    console.error('Error creating consultation:', error);
    return error;
  }
};

export const updateConsultation = async (consultationId, updatedData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/update-consultation/${consultationId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating consultation:', error);
    return error;
  }
};

export const deleteConsultation = async (consultationId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/consultation/${consultationId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting consultation:', error);
    return error;
  }
};