import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchClients } from '../api/clients';
import * as React from 'react';

const Clients = () => {
  interface Client {
    _id: string;
    name: string;
    email: string;
  }

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Mes Clients</h2>
      {clients.length > 0 ? (
        <ul className="space-y-4">
          {clients.map((client) => (
            <li key={client._id} className="border-b py-2">
              <Link to={`/dashboard/clients/${client._id}`} className="text-blue-500 hover:underline">
                {client.name} ({client.email})
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun client enregistré.</p>
      )}
    </div>
  );
};

export default Clients;