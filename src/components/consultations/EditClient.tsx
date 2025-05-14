import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchClient, updateClient } from '../../api/clients';
import { toast } from 'react-toastify';
import { DashboardContext } from '../../pages/Dashboard';
import { GiHamburgerMenu } from 'react-icons/gi';
import CircleLoader from 'react-spinners/CircleLoader';
import React from 'react';

const EditClient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleToggleClick } = useContext(DashboardContext);
  const [values, setValues] = useState({
      firstName: '',
      lastName: '',
      address: '',
      municipality: '',
      postalCode: '',
      phone: '',
    });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadClient = async () => {
      try {
        const client = await fetchClient(id);
        setValues({
          firstName: client.firstName || '',
          lastName: client.lastName || '',
          address: client.address || '',
          municipality: client.municipality || '',
          postalCode: client.postalCode || '',
          phone: client.phone || '',
        });
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Erreur lors de la récupération du client');
        setLoading(false);
      }
    };
    loadClient();
  }, [id]);

  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateClient(id, values)
      .then(() => {
        toast.success('Client mis à jour', {
          position: 'top-right',
          autoClose: 5000,
        });
        navigate('/dashboard/clients');
      })
      .catch((err) => {
        console.error('Error updating client:', {
          message: err.message,
          response: err.response ? {
            status: err.response.status,
            data: err.response.data,
          } : 'No response',
        });
        toast.error('Erreur lors de la mise à jour du client', {
          position: 'top-right',
          autoClose: 5000,
        });
      });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="topbar">
          <div className="toggle" onClick={handleToggleClick}>
            <GiHamburgerMenu />
          </div>
        </div>
        <CircleLoader loading={loading} size={50} />
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
    <>
      <div className="topbar">
        <div className="toggle" onClick={handleToggleClick}>
          <GiHamburgerMenu />
        </div>
      </div>
      <div className="add-form-container">
        <form className="add-form" onSubmit={handleSubmit}>
          <h2>Modifier un Client</h2>
          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                placeholder="Nom"
                className="form-control"
                name="lastName"
                required
                value={values.lastName}
                onChange={handleInput}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Prénom"
                className="form-control"
                name="firstName"
                required
                value={values.firstName}
                onChange={handleInput}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <input
                type="tel"
                placeholder="Téléphone"
                className="form-control"
                name="phone"
                required
                value={values.phone}
                onChange={handleInput}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Adresse"
                className="form-control"
                name="address"
                required
                value={values.address}
                onChange={handleInput}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                placeholder="Municipalité"
                className="form-control"
                name="municipality"
                required
                value={values.municipality}
                onChange={handleInput}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Code postal"
                className="form-control"
                name="postalCode"
                required
                value={values.postalCode}
                onChange={handleInput}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard/clients')}
              className="form-btn bg-gray-600"
            >
              Annuler
            </button>
            <button type="submit" className="form-btn">
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditClient;