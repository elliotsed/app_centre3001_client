import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { fetchClients } from '../api/clients';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { FaEye, FaRegTrashCan } from 'react-icons/fa6';
import { FaEdit } from 'react-icons/fa';
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
      backgroundColor: '#f9fafb',
      color: '#111827',
      borderBottom: '1px solid #e5e7eb',
    },
  },
  cells: {
    style: {
      fontSize: '14px',
      fontWeight: 500,
    },
  },
};

const Clients = () => {
  interface Client {
    _id: string;
    firstName: string;
    lastName: string;
    clientNumber: string;
    address: string;
    municipality: string;
    postalCode: string;
    remarque: string;
    phone: string;
    consultations?: string[];
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

        const sortedData = data.sort((a, b) => b._id.localeCompare(a._id));

        setClients(sortedData); 
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
          .then(() => {
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
      name: 'Prénom',
      selector: (row: Client) => row.firstName || 'N/A',
      sortable: true,
    },
    {
      name: 'Nom',
      selector: (row: Client) => row.lastName || 'N/A',
      sortable: true,
    },
    {
      name: 'N° Client',
      selector: (row: Client) => row.clientNumber || 'N/A',
    },
     {
      name: 'Remarque',
      selector: (row: Client) => row.remarque || 'N/A',
    },
    {
      name: 'Actions',
      cell: (row: Client) => (
        <div className="flex items-center gap-3">
          <Link to={`/dashboard/clients/${row._id}`}>
            <FaEye className="text-blue-600 hover:text-blue-800 cursor-pointer text-lg" />
          </Link>
          <Link to={`/dashboard/edit-client/${row._id}`}>
            <FaEdit className="text-green-600 hover:text-green-800 cursor-pointer text-lg" />
          </Link>
          <FaRegTrashCan
            className="text-red-500 hover:text-red-700 cursor-pointer text-lg"
            onClick={() => deleteClient(row._id)}
          />
        </div>
      ),
    },
  ];

  const filteredClients = clients.filter((client) =>
    [client.firstName, client.lastName, client.clientNumber]
      .some(field => field?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div
            className="p-2 bg-primaryColor rounded-md text-white cursor-pointer"
            onClick={handleToggleClick}
          >
            <GiHamburgerMenu />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Liste des clients</h2>
        </div>

        <input
          type="text"
          placeholder="🔍 Rechercher..."
          className="mt-4 sm:mt-0 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor w-full sm:w-80"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-lg border shadow bg-white p-4">
        <DataTable
          columns={columns}
          data={filteredClients}
          customStyles={customStyles}
          pagination
          noDataComponent={<div className="text-center text-gray-600 py-4">Aucun client trouvé</div>}
        />
      </div>
    </div>
  );
};

export default Clients;