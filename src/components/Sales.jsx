import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import CircleLoader from 'react-spinners/CircleLoader';
import { FaTrash, FaEdit, FaPlus, FaDownload } from 'react-icons/fa';
import { fetchSales, deleteSale } from '../api/sales';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import html2pdf from 'html2pdf.js';
import '../assets/css/Sales.css';

const MySwal = withReactContent(Swal);

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');
  const tableRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

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
    if (location.state?.refresh) {
      loadSales();
    }
  }, [location]);

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
          await loadSales();
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

  const handleEdit = (saleId) => {
    navigate(`/dashboard/sales/edit/${saleId}`);
  };

  const handleDownloadPDF = () => {
    const tableElement = tableRef.current.cloneNode(true);
    const rows = tableElement.querySelectorAll('tr');
    rows.forEach((row) => {
      const cells = row.querySelectorAll('th, td');
      if (cells.length > 0) {
        row.removeChild(cells[cells.length - 1]);
      }
    });

    const container = document.createElement('div');
    const title = document.createElement('h2');
    title.textContent = 'Suivi des Ventes Auris';
    title.style.textAlign = 'center';
    title.style.margin = '20px 0';
    title.style.fontSize = '18px';
    title.style.fontWeight = 'bold';

    const date = document.createElement('p');
    date.textContent = `Généré le ${new Date().toLocaleDateString()} à ${new Date().toLocaleTimeString()}`;
    date.style.textAlign = 'center';
    date.style.marginBottom = '20px';
    date.style.fontSize = '12px';

    container.appendChild(title);
    container.appendChild(date);
    container.appendChild(tableElement);

    tableElement.classList.add('pdf-table');

    const options = {
      filename: `Suivi_des_Ventes_Auris_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'landscape',
        compress: true,
      },
      margin: [15, 15, 15, 15],
    };

    html2pdf().from(container).set(options).save();
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
        <CircleLoader loading={false} size={50} />
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
    <div className="max-w-7xl mt-20 mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-700">Suivi des Ventes Auris</h2>
        <div className="flex gap-2">
          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primaryColor text-white rounded-lg hover:bg-opacity-90 transition"
            disabled={filteredSales.length === 0}
          >
            <FaDownload />
            Télécharger le tableau
          </button>
          <Link
            to="/dashboard/sales/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primaryColor text-white rounded-lg hover:bg-opacity-90 transition"
          >
            <FaPlus />
            Ajouter une vente
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Rechercher par n° de lot, nom ou prénom..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div className="flex space-x-2 mb-6">
        {years.map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`px-4 py-2 rounded-lg transition ${
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
          <table ref={tableRef} className="min-w-full bg-white rounded-lg shadow overflow-hidden">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-sm font-semibold">
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Facture N°</th>
                <th className="py-3 px-4 text-left">Nom</th>
                <th className="py-3 px-4 text-left">Prénom</th>
                <th className="py-3 px-4 text-left">N° de référence</th>
                <th className="py-3 px-4 text-left">Nom du produit</th>
                <th className="py-3 px-4 text-left">N° de lot</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale._id} className="border-b hover:bg-gray-100 transition">
                  <td className="py-3 px-4">{new Date(sale.date).toLocaleDateString()}</td>
                  <td className="py-3 px-4">{sale.invoiceNumber}</td>
                  <td className="py-3 px-4">{sale.lastName}</td>
                  <td className="py-3 px-4">{sale.firstName}</td>
                  <td className="py-3 px-4">{sale.referenceNumber}</td>
                  <td className="py-3 px-4">{sale.productName}</td>
                  <td className="py-3 px-4">{sale.lotNumber}</td>
                  <td className="py-3 px-4 flex space-x-4">
                    <button
                      onClick={() => handleEdit(sale._id)}
                      className="inline-flex items-center gap-2 px-2 py-1 bg-primaryColor text-white rounded-lg hover:bg-opacity-80"
                      title="Modifier la vente"
                    >
                      <FaEdit />
                      <span className="text-sm">Modifier</span>
                    </button>
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