import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CircleLoader from 'react-spinners/CircleLoader';
import { fetchSales } from '../api/sales'; // À créer

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSales = async () => {
      try {
        const data = await fetchSales();
        if (data instanceof Error) throw data;
        setSales(data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors de la récupération des ventes');
        setLoading(false);
      }
    };
    loadSales();
  }, []);

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
      </div>
    );
  }

  return (
    <div className="max-w-6xl mt-20 mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-700">Suivi des Ventes Auris</h2>
        <Link
          to="/dashboard/sales/new"
          className="inline-block px-4 py-2 bg-primaryColor text-white rounded-lg hover:bg-opacity-80"
        >
          Ajouter une vente
        </Link>
      </div>
      {sales.length > 0 ? (
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
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{new Date(sale.date).toLocaleDateString()}</td>
                  <td className="py-3 px-4">{sale.invoiceNumber}</td>
                  <td className="py-3 px-4">{sale.lastName}</td>
                  <td className="py-3 px-4">{sale.firstName}</td>
                  <td className="py-3 px-4">{sale.referenceNumber}</td>
                  <td className="py-3 px-4">{sale.productName}</td>
                  <td className="py-3 px-4">{sale.lotNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-600">Aucune vente enregistrée.</p>
      )}
    </div>
  );
};

export default Sales;