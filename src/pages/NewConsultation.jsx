import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ConsultationForm from '../components/consultations/ConsultationForm';
import { fetchClient } from '../api/clients';
import CircleLoader from 'react-spinners/CircleLoader';

const NewConsultation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
      <h2 className="text-2xl font-bold text-gray-700 mb-6">
        Nouvelle Consultation pour {client.name}
      </h2>
      <ConsultationForm
        clientId={id}
        onConsultationAdded={() => {
          navigate(`/dashboard/clients/${id}`);
        }}
      />
    </div>
  );
};

export default NewConsultation;