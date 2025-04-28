import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { fetchClients } from '../api/clients';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { FaPenToSquare, FaRegTrashCan, FaEye } from 'react-icons/fa6';
import CircleLoader from 'react-spinners/CircleLoader';
import { GiHamburgerMenu } from 'react-icons/gi';
import { DashboardContext } from '../pages/Dashboard';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import '../assets/css/contacts.css';
import React from 'react';

const MySwal = withReactContent(Swal);

const customStyles = {
  headCells: {
    style: {
      fontSize: '15px',
      fontWeight: 600,
    },
  },
  cells: {
    style: {
      fontSize: '13px',
      fontWeight: 500,
    },
  },
};

const Clients = () => {
  interface Client {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
  }

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { handleToggleClick } = useContext(DashboardContext);

  useEffect(() => {
    const loadClients = async () => {
      try {
        const data = await fetchClients();
        if (data instanceof Error) throw data;
        setClients(data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors de la récupération des clients');
        setLoading(false);
      }
    };
    loadClients();
  }, []);

  const deleteClient = (id: string) => {
    MySwal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Ce client sera supprimé !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`https://app-centre3001-api.vercel.app/gestion_contact/client/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
          .then((res) => {
            setClients(clients.filter((client) => client._id !== id));
            MySwal.fire({
              title: 'Supprimé !',
              text: 'Ce client a bien été supprimé !',
              icon: 'success',
            });
          })
          .catch(() => {
            MySwal.fire({
              title: 'Erreur !',
              text: 'Une erreur est survenue !',
              icon: 'error',
            });
          });
      }
    });
  };

  const columns = [
    {
      name: 'Nom',
      selector: (row: Client) => row.name,
    },
    {
      name: 'Email',
      selector: (row: Client) => row.email,
    },
    {
      name: 'Action',
      cell: (row: Client) => (
        <div className="action-icons">
          <Link to={`/dashboard/clients/${row._id}`}>
            <FaEye className="table-icon1" />
          </Link>
          {/* <Link to={`/dashboard/edit-client/${row._id}`}>
            <FaPenToSquare className="table-icon2" />
          </Link> */}
          <FaRegTrashCan className="table-icon3" onClick={() => deleteClient(row._id)} />
        </div>
      ),
    },
  ];

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="topbar">
          <div className="toggle" onClick={handleToggleClick}>
            <GiHamburgerMenu />
          </div>
        </div>
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
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="topbar">
        <div className="toggle" onClick={handleToggleClick}>
          <GiHamburgerMenu />
        </div>
        <div className="search">
          <label>
            <input
              type="text"
              placeholder="Rechercher par nom ou email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-700 mb-6">Mes Clients</h2>

      <div className="contact-list">
        <DataTable
          columns={columns}
          data={filteredClients}
          customStyles={customStyles}
          pagination
          noDataComponent={<h1><strong>Aucun client ajouté</strong></h1>}
        />
      </div>
    </div>
  );
};

export default Clients;