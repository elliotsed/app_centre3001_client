import * as React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchConsultation } from '../api/clients';

const ConsultationDetails = () => {
  const { id } = useParams();
  interface Consultation {
    date: string;
    consultationReason: string;
    allergies?: string;
    artificialLimb?: boolean;
    pacemaker?: boolean;
    bloodPressure?: string;
    covidOrVirus?: string;
    painAreas?: { bodyPart: string; direction: string; intensity: number; maxIntensity: number }[];
    scars?: { bodyPart: string; description: string }[];
    practitionerObservations?: string;
    problemDuration?: string;
    medicalIndication?: string;
    medication?: string;
    disease?: string;
    treatmentDetails?: string;
    clientComment?: string;
    improvementPercentage: number;
  }
  
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConsultation = async () => {
      try {
        const data = await fetchConsultation(id);
        if (data instanceof Error) throw data;
        setConsultation(data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors de la récupération de la consultation');
        setLoading(false);
      }
    };
    loadConsultation();
  }, [id]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;
  if (!consultation) return <p>Consultation non trouvée</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Détails de la Consultation</h2>
      <p><strong>Date :</strong> {new Date(consultation.date).toLocaleDateString()}</p>
      <p><strong>Motif :</strong> {consultation.consultationReason}</p>
      <p><strong>Allergies :</strong> {consultation.allergies || 'Aucune'}</p>
      <p><strong>Membre artificiel :</strong> {consultation.artificialLimb ? 'Oui' : 'Non'}</p>
      <p><strong>Pacemaker :</strong> {consultation.pacemaker ? 'Oui' : 'Non'}</p>
      <p><strong>Pression artérielle :</strong> {consultation.bloodPressure || 'N/A'}</p>
      <p><strong>Covid/Virus :</strong> {consultation.covidOrVirus || 'Aucun'}</p>
      <h3 className="text-lg font-semibold mt-4">Douleurs</h3>
      {consultation.painAreas && consultation.painAreas.length > 0 ? (
        <ul className="list-disc pl-5">
          {consultation.painAreas.map((pain, index) => (
            <li key={index}>
              {pain.bodyPart}: {pain.direction}, Actuel: {pain.intensity}%, Max: {pain.maxIntensity}%
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucune douleur enregistrée.</p>
      )}
      <h3 className="text-lg font-semibold mt-4">Cicatrices</h3>
      {consultation.scars && consultation.scars.length > 0 ? (
        <ul className="list-disc pl-5">
          {consultation.scars.map((scar, index) => (
            <li key={index}>{scar.bodyPart}: {scar.description}</li>
          ))}
        </ul>
      ) : (
        <p>Aucune cicatrice enregistrée.</p>
      )}
      <p><strong>Observations du praticien :</strong> {consultation.practitionerObservations || 'N/A'}</p>
      <p><strong>Durée du problème :</strong> {consultation.problemDuration || 'N/A'}</p>
      <p><strong>Indication médicale :</strong> {consultation.medicalIndication || 'N/A'}</p>
      <p><strong>Médication :</strong> {consultation.medication || 'Aucune'}</p>
      <p><strong>Maladie :</strong> {consultation.disease || 'Aucune'}</p>
      <p><strong>Détails du traitement :</strong> {consultation.treatmentDetails || 'N/A'}</p>
      <p><strong>Commentaire du client :</strong> {consultation.clientComment || 'N/A'}</p>
      <p><strong>Pourcentage d’amélioration :</strong> {consultation.improvementPercentage}%</p>
    </div>
  );
};

export default ConsultationDetails;