import axios from 'axios';

const API_BASE_URL = 'https://app-centre3001-api.vercel.app/gestion_contact/sales';
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("token")}`;

export const fetchSales = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching sales:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const fetchSale = async (saleId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${saleId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sale:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    if (error.response?.status === 404) {
      throw new Error('Vente non trouvée');
    } else if (error.response?.status === 401) {
      throw new Error('Non autorisé: veuillez vous reconnecter');
    }
    throw new Error('Erreur lors de la récupération de la vente');
  }
};

export const createSale = async (saleData) => {
  try {
    const response = await axios.post(API_BASE_URL, saleData);
    return response.data;
  } catch (error) {
    console.error('Error creating sale:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const updateSale = async (saleId, saleData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${saleId}`, saleData);
    return response.data;
  } catch (error) {
    console.error('Error updating sale:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    if (error.response?.status === 404) {
      throw new Error('Vente non trouvée');
    } else if (error.response?.status === 401) {
      throw new Error('Non autorisé: veuillez vous reconnecter');
    }
    throw new Error('Erreur lors de la mise à jour de la vente');
  }
};

export const deleteSale = async (saleId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('deleteSale: Aucun token trouvé dans localStorage');
      throw new Error('Non autorisé: veuillez vous connecter');
    }
    const response = await axios.delete(`${API_BASE_URL}/${saleId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting sale:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error.response?.status === 401
      ? new Error('Non autorisé: veuillez vous reconnecter')
      : error;
  }
};