import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchSale, updateSale } from '../api/sales';
import CircleLoader from 'react-spinners/CircleLoader';
import React from 'react';

const EditSale = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: '',
    invoiceNumber: '',
    firstName: '',
    lastName: '',
    referenceNumber: '',
    productName: '',
    lotNumber: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSale = async () => {
      try {
        const sale = await fetchSale(id);
        setFormData({
          date: new Date(sale.date).toISOString().split('T')[0], // Format yyyy-mm-dd
          invoiceNumber: sale.invoiceNumber,
          firstName: sale.firstName,
          lastName: sale.lastName,
          referenceNumber: sale.referenceNumber,
          productName: sale.productName,
          lotNumber: sale.lotNumber,
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        if (err.message.includes('Non autorisé')) {
          navigate('/login');
        }
      }
    };
    loadSale();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateSale(id, formData);
      navigate('/dashboard/sales', { state: { refresh: true } });
    } catch (err) {
      setError(err.message);
      if (err.message.includes('Non autorisé')) {
        navigate('/login');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <CircleLoader
          loading={loading}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
        {error.includes('Non autorisé') && (
          <button
            onClick={() => navigate('/login')}
            className="mt-4 px-4 py-2 bg-primaryColor text-white rounded-lg hover:bg-opacity-80"
          >
            Se connecter
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mt-20 mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Modifier une Vente Auris</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Facture N°</label>
          <input
            type="text"
            name="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Nom</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Prénom</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">N° de référence</label>
          <input
            type="text"
            name="referenceNumber"
            value={formData.referenceNumber}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Nom du produit</label>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">N° de lot</label>
          <input
            type="text"
            name="lotNumber"
            value={formData.lotNumber}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded-md"
            required
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard/sales')}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-opacity-80"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primaryColor text-white rounded-lg hover:bg-opacity-80"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditSale;