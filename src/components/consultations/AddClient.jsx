import { useState,  useContext  } from 'react';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { DashboardContext } from '../../pages/Dashboard';
import { GiHamburgerMenu } from 'react-icons/gi';

const AddClient = () => {
  const [values, setValues] = useState({
    name: '',
    address: '',
    email: '',
    phone: ''
  });
  const navigate = useNavigate();
  const { handleToggleClick } = useContext(DashboardContext);

  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting client with data:', values);
    console.log('Token:', localStorage.getItem('token'));

    axios
      .post('https://app-centre3001-api.vercel.app/gestion_contact/add-client', values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((res) => {
        console.log('API response:', res.data);
        toast.success('Client ajouté', {
          position: 'top-right',
          autoClose: 5000
        });
        navigate('/dashboard/clients');
      })
      .catch((err) => {
        console.error('Error adding client:', {
          message: err.message,
          response: err.response ? {
            status: err.response.status,
            data: err.response.data
          } : 'No response'
        });
        toast.error('Erreur lors de l\'ajout du client', {
          position: 'top-right',
          autoClose: 5000
        });
      });
  };

  return (
    <>
      <div className="topbar">
        <div className="toggle" onClick={handleToggleClick}>
          <GiHamburgerMenu />
        </div>
      </div>
      <div className="add-form-container">
        <form className="add-form" onSubmit={handleSubmit}>
          <h2>Ajouter un Client</h2>
          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                placeholder="Nom"
                className="form-control"
                name="name"
                required
                value={values.name}
                onChange={handleInput}
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email"
                className="form-control"
                name="email"
                required
                value={values.email}
                onChange={handleInput}
              />
            </div>
          </div>
          <div className="form-row">
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
            <div className="form-group">
              <input
                type="tel"
                placeholder="Téléphone"
                className="form-control"
                name="phone"
                value={values.phone}
                onChange={handleInput}
              />
            </div>
          </div>
          <button className="form-btn">Ajouter</button>
        </form>
      </div>
    </>
  );
};

export default AddClient;