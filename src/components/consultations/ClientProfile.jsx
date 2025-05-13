import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchClient } from '../../api/clients';
import CircleLoader from 'react-spinners/CircleLoader';
import {
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaPlus,
  FaEye,
  FaCalendarAlt,
  FaFileMedical
} from 'react-icons/fa';

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
        <CircleLoader loading={loading} size={50} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <CircleLoader loading={false} size={50} />
        <p className="mt-4 text-red-500">{error}</p>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <CircleLoader loading={false} size={50} />
        <p className="mt-4 text-gray-600">Client non trouvé</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mt-20 mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-primaryColor flex items-center gap-2">
        <FaUser className="text-blue-600" />
        Profil du client
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Infos client */}
        <div className="bg-gray-50 rounded-lg p-4 shadow-sm border">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Informations personnelles</h3>
          <p><FaFileMedical className="inline text-purple-600 mr-2" /><strong>Client N° :</strong> {client.clientNumber || 'N/A'}</p>
          <p><FaUser className="inline text-blue-600 mr-2" /><strong>Nom :</strong> {client.lastName}</p>
          <p><FaUser className="inline text-blue-400 mr-2" /><strong>Prénom :</strong> {client.firstName}</p>
          <p><FaMapMarkerAlt className="inline text-green-600 mr-2" /><strong>Adresse :</strong> {client.address || 'N/A'}</p>
          <p><FaMapMarkerAlt className="inline text-green-600 mr-2" /><strong>Municipalité :</strong> {client.municipality || 'N/A'}</p>
          <p><FaMapMarkerAlt className="inline text-green-600 mr-2" /><strong>Code postal :</strong> {client.postalCode || 'N/A'}</p>
          <p><FaPhone className="inline text-yellow-600 mr-2" /><strong>Téléphone :</strong> {client.phone || 'N/A'}</p>
        </div>

        {/* Consultations */}
        <div className="bg-gray-50 rounded-lg p-4 shadow-sm border">
          <h3 className="text-xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
            <FaFileMedical className="text-red-500" />
            Consultations
          </h3>

          {client.consultations && client.consultations.length > 0 ? (
            <ul className="space-y-4">
              {client.consultations.map((consultation) => (
                <li key={consultation._id} className="border-b pb-3">
                  <p><FaCalendarAlt className="inline text-pink-500 mr-2" /><strong>Date :</strong> {new Date(consultation.date).toLocaleDateString()}</p>
                  <p><FaFileMedical className="inline text-gray-600 mr-2" /><strong>Motif :</strong> {consultation.consultationReason}</p>
                  <Link
                    to={`/dashboard/consultations/${consultation._id}`}
                    className="inline-flex items-center gap-2 mt-2 px-3 py-2 bg-primaryColor text-white rounded-md hover:bg-opacity-90 text-sm"
                  >
                    <FaEye />
                    Voir détails
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 italic">Aucune consultation enregistrée.</p>
          )}
        </div>
      </div>

      {/* Ajouter consultation */}
      <div className="mt-8">
        <Link
          to={`/dashboard/clients/${id}/consultations/new`}
          className="inline-flex items-center gap-2 px-5 py-3 bg-primaryColor text-white rounded-lg hover:bg-green-700 transition-all"
        >
          <FaPlus />
          Ajouter une consultation
        </Link>
      </div>
    </div>
  );
};

export default ClientProfile;
