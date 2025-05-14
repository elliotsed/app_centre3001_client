import axios from 'axios';

const API_BASE_URL = 'https://app-centre3001-api.vercel.app/gestion_contact';

// --- Clients ---
export const fetchClients = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Non autorisé: aucun token trouvé');
    const response = await axios.get(`${API_BASE_URL}/clients`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching clients:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    if (error.response?.status === 401) {
      throw new Error('Non autorisé: veuillez vous reconnecter');
    }
    throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des clients');
  }
};

export const fetchClient = async (id) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Non autorisé: aucun token trouvé');
    const response = await axios.get(`${API_BASE_URL}/clients/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching client:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    if (error.response?.status === 404) {
      throw new Error('Client non trouvé');
    } else if (error.response?.status === 401) {
      throw new Error('Non autorisé: veuillez vous reconnecter');
    }
    throw new Error(error.response?.data?.message || 'Erreur lors de la récupération du client');
  }
};

export const createClient = async (clientData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Non autorisé: aucun token trouvé');
    const response = await axios.post(`${API_BASE_URL}/add-client`, clientData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating client:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error(error.response?.data?.message || 'Erreur lors de la création du client');
  }
};

export const updateClient = async (clientId, updatedData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Non autorisé: aucun token trouvé');
    const response = await axios.put(`${API_BASE_URL}/update-client/${clientId}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating client:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    if (error.response?.status === 404) {
      throw new Error('Client non trouvé');
    } else if (error.response?.status === 401) {
      throw new Error('Non autorisé: veuillez vous reconnecter');
    }
    throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour du client');
  }
};

export const deleteClient = async (clientId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Non autorisé: aucun token trouvé');
    const response = await axios.delete(`${API_BASE_URL}/client/${clientId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting client:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    if (error.response?.status === 404) {
      throw new Error('Client non trouvé');
    } else if (error.response?.status === 401) {
      throw new Error('Non autorisé: veuillez vous reconnecter');
    }
    throw new Error(error.response?.data?.message || 'Erreur lors de la suppression du client');
  }
};

// --- Consultations ---
export const fetchConsultations = async (clientId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Non autorisé: aucun token trouvé');
    const response = await axios.get(`${API_BASE_URL}/consultations/${clientId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching consultations:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    if (error.response?.status === 401) {
      throw new Error('Non autorisé: veuillez vous reconnecter');
    }
    throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des consultations');
  }
};

export const fetchConsultation = async (id) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Non autorisé: aucun token trouvé');
    const response = await axios.get(`${API_BASE_URL}/consultation/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching consultation:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    if (error.response?.status === 404) {
      throw new Error('Consultation non trouvée');
    } else if (error.response?.status === 401) {
      throw new Error('Non autorisé: veuillez vous reconnecter');
    }
    throw new Error(error.response?.data?.message || 'Erreur lors de la récupération de la consultation');
  }
};

export const createConsultation = async (consultationData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Non autorisé: aucun token trouvé');
    const response = await axios.post(`${API_BASE_URL}/add-consultation`, consultationData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating consultation:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error(error.response?.data?.message || 'Erreur lors de la création de la consultation');
  }
};

export const updateConsultation = async (consultationId, updatedData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Non autorisé: aucun token trouvé');
    const response = await axios.put(`${API_BASE_URL}/update-consultation/${consultationId}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating consultation:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    if (error.response?.status === 404) {
      throw new Error('Consultation non trouvée');
    } else if (error.response?.status === 401) {
      throw new Error('Non autorisé: veuillez vous reconnecter');
    }
    throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour de la consultation');
  }
};

export const deleteConsultation = async (consultationId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Non autorisé: aucun token trouvé');
    const response = await axios.delete(`${API_BASE_URL}/consultation/${consultationId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting consultation:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    if (error.response?.status === 404) {
      throw new Error('Consultation non trouvée');
    } else if (error.response?.status === 401) {
      throw new Error('Non autorisé: veuillez vous reconnecter');
    }
    throw new Error(error.response?.data?.message || 'Erreur lors de la suppression de la consultation');
  }
};