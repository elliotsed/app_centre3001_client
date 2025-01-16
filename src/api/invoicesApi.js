
import axios from 'axios';


const API_BASE_URL = 'http://localhost:3000/gestion_contact/invoices';
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("token")}`;

export const fetchInvoices = async () => {
    try {
        const response = await axios.get(API_BASE_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching invoices:', error);
        // throw error;
        return error;
    }
};

export const fetchInvoice = async (id) => {
    try {
        const response = await axios.get(API_BASE_URL + "/" + id);
        return response.data;
    } catch (error) {
        console.error('Error fetching invoices:', error);
        // throw error;
        return error;
    }
};


export const createInvoice = async (invoiceData) => {
    try {
        const response = await axios.post(API_BASE_URL, invoiceData);
        return response.data;
    } catch (error) {
        console.error('Error creating invoice:', error);
        return error;
    }
};


export const updateInvoice = async (invoiceId, updatedData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/${invoiceId}`, updatedData);
        return response.data;
    } catch (error) {
        console.error('Error updating invoice:', error);
        return error;
    }
};


export const downloadInvoice = async (invoiceId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${invoiceId}/download`, {
            responseType: 'blob', 
        });
        return response.data;
    } catch (error) {
        console.error('Error downloading invoice:', error);
        return error;
    }
};
