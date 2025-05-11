import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CircleLoader from 'react-spinners/CircleLoader';
import { FaTrash } from 'react-icons/fa';
import { fetchSales, deleteSale } from '../api/sales';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');

  const loadSales = async () => {
    try {
      const data = await fetchSales();
      setSales(data);
      setFilteredSales(data);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Erreur lors de la récupération des ventes');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, []);

  // Filtrer par recherche et année
  useEffect(() => {
    let filtered = sales;
    if (searchTerm) {
      filtered = sales.filter(
        (sale) =>
          sale.lotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sale.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sale.firstName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedYear !== 'all') {
      filtered = filtered.filter(
        (sale) => new Date(sale.date).getFullYear() === parseInt(selectedYear)
      );
    }
    setFilteredSales(filtered);
  }, [searchTerm, selectedYear, sales]);

  const handleDelete = async (saleId) => {
    MySwal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette vente sera supprimée !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteSale(saleId);
          await loadSales(); // Recharger les ventes après suppression
          MySwal.fire({
            title: 'Supprimé !',
            text: 'Cette vente a bien été supprimée !',
            icon: 'success',
          });
        } catch (err) {
          MySwal.fire({
            title: 'Erreur !',
            text:
              err.response?.status === 404
                ? 'Vente non trouvée ou déjà supprimée'
                : err.message || 'Erreur lors de la suppression de la vente',
            icon: 'error',
          });
        }
      }
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const years = ['all', 2025, 2026, 2027];

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
        <CircleLoader
          loading={false}
          size={50}
          aria-label="Error Spinner"
          data-testid="error-loader"
        />
        <p className="mt-4 text-red-500">{error}</p>
        {error.includes('Non autorisé') && (
          <Link
            to="/login"
            className="mt-4 px-4 py-2 bg-primaryColor text-white rounded-lg hover:bg-opacity-80"
          >
            Se connecter
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mt-20 mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-700">Suivi des Ventes Auris</h2>
        <div className="flex space-x-4">
      
          <Link
            to="/dashboard/sales/new"
            className="inline-block px-4 py-2 bg-primaryColor text-white rounded-lg hover:bg-opacity-80"
          >
            Ajouter une vente
          </Link>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Rechercher par n° de lot, nom ou prénom..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>

      {/* Onglets par année */}
      <div className="flex space-x-2 mb-6">
        {years.map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`px-4 py-2 rounded-lg ${
              selectedYear === year
                ? 'bg-primaryColor text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {year === 'all' ? 'Toutes' : year}
          </button>
        ))}
      </div>

      {filteredSales.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Facture N°</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Nom</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Prénom</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">N° de référence</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Nom du produit</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">N° de lot</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{new Date(sale.date).toLocaleDateString()}</td>
                  <td className="py-3 px-4">{sale.invoiceNumber}</td>
                  <td className="py-3 px-4">{sale.lastName}</td>
                  <td className="py-3 px-4">{sale.firstName}</td>
                  <td className="py-3 px-4">{sale.referenceNumber}</td>
                  <td className="py-3 px-4">{sale.productName}</td>
                  <td className="py-3 px-4">{sale.lotNumber}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleDelete(sale._id)}
                      className="text-red-500 hover:text-red-700"
                      title="Supprimer"
                    >
                      <FaTrash />
                     
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-600">Aucune vente trouvée.</p>
      )}
    </div>
  );
};

export default Sales;