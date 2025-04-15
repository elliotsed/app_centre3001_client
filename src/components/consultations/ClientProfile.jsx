import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ConsultationForm from './ConsultationForm';
import { fetchClient } from '../../api/clients'; // Assurez-vous que le chemin est correct

const ClientProfile = () => {
  const { id } = useParams(); // Récupère l'ID depuis l'URL
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

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;
  if (!client) return <p>Client non trouvé</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Dossier Client</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><strong>Nom :</strong> {client.name}</p>
          <p><strong>Adresse :</strong> {client.address}</p>
          <p><strong>Email :</strong> {client.email}</p>
          <p><strong>Téléphone :</strong> {client.phone || 'N/A'}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Consultations</h3>
          {client.consultations && client.consultations.length > 0 ? (
            <ul className="space-y-2">
              {client.consultations.map((consultation) => (
                <li key={consultation._id} className="border-b py-2">
                  <p><strong>Date :</strong> {new Date(consultation.date).toLocaleDateString()}</p>
                  <p><strong>Motif :</strong> {consultation.consultationReason}</p>
                  <a href={`/dashboard/consultations/${consultation._id}`} className="text-blue-500 hover:underline">
                    Voir détails
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucune consultation enregistrée.</p>
          )}
        </div>
      </div>
      <ConsultationForm
        clientId={id}
        onConsultationAdded={(newConsultation) => {
          setClient({
            ...client,
            consultations: [...(client.consultations || []), newConsultation],
          });
        }}
      />
    </div>
  );
};

export default ClientProfile;