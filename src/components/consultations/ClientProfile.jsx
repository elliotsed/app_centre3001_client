import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchClient } from '../../api/clients';
import CircleLoader from 'react-spinners/CircleLoader';

const ClientProfile = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadClient = async () => {
      try {
        const data = await fetchClient(id);
        if (data instanceof Error) throw data;
        setClient(data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors de la récupération du client');
        setLoading(false);
      }
    };
    loadClient();
  }, [id]);

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

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <CircleLoader
          loading={false}
          size={50}
          aria-label="Not Found Spinner"
          data-testid="not-found-loader"
        />
        <p className="mt-4 text-gray-600">Client non trouvé</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mt-20 mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Dossier Client</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><strong>Nom :</strong> {client.name}</p>
          <p><strong>Adresse :</strong> {client.address || 'N/A'}</p>
          <p><strong>Email :</strong> {client.email}</p>
          <p><strong>Téléphone :</strong> {client.phone || 'N/A'}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Consultations</h3>
          {client.consultations && client.consultations.length > 0 ? (
            <ul className="space-y-4">
              {client.consultations.map((consultation) => (
                <li key={consultation._id} className="border-b py-2">
                  <p><strong>Date :</strong> {new Date(consultation.date).toLocaleDateString()}</p>
                  <p><strong>Motif :</strong> {consultation.consultationReason}</p>
                  <Link
                    to={`/dashboard/consultations/${consultation._id}`}
                    className="inline-block mt-2 px-4 py-2 bg-primaryColor text-white rounded-lg hover:bg-opacity-80"
                  >
                    Voir détails
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">Aucune consultation enregistrée.</p>
          )}
        </div>
      </div>
      <div className="mt-6">
        <Link
          to={`/dashboard/clients/${id}/consultations/new`}
          className="inline-block px-4 py-2 bg-primaryColor text-white rounded-lg hover:bg-opacity-80"
        >
          Ajouter une consultation
        </Link>
      </div>
    </div>
  );
};

export default ClientProfile;