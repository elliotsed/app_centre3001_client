import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { fetchConsultation } from '../api/clients';
import { ExclamationCircleIcon } from '@heroicons/react/outline';
import { FaDownload } from 'react-icons/fa';
import CircleLoader from 'react-spinners/CircleLoader';
import html2pdf from 'html2pdf.js';
import '../assets/css/ConsultationDetails.css';

const ConsultationDetails = () => {
  const { id } = useParams();
  const consultationRef = useRef<HTMLDivElement>(null);

  interface Consultation {
    date: string;
    allergies?: string;
    artificialLimb?: boolean;
    pacemaker?: boolean;
    bloodPressure?: string;
    covidOrVirus?: string;
    other?: string;
    painAreas?: { bodyPart: string; side?: string; intensity: number; maxIntensity: number }[];
    scars?: { bodyPart: string; description: string }[];
    consultationReason?: string;
    practitionerObservations?: string;
    problemDuration?: string;
    medicalIndication?: string;
    medication?: string;
    disease?: string;
    treatmentDetails?: string;
    clientComment?: string;
    improvementPercentage?: number;
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

  // Nouvelle fonction pour télécharger en PDF avec une meilleure apparence
  const handleDownloadPDF = () => {
    if (!consultation) return;

    // Appliquer une classe spéciale pour l'impression/PDF
    if (consultationRef.current) {
      consultationRef.current.classList.add('print-mode');
    }

    const options = {
      filename: `Consultation_${id}_${new Date(consultation.date).toLocaleDateString('fr-FR')}.pdf`,
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        letterRendering: true,
        imageTimeout: 0
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
        compress: true,
        precision: 16
      },
      margin: [15, 15, 15, 15],
      image: { type: 'jpeg', quality: 1 },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().from(consultationRef.current).set(options).save().then(() => {
      // Retirer la classe après la génération du PDF
      if (consultationRef.current) {
        consultationRef.current.classList.remove('print-mode');
      }
    });
  };

  // Fonction pour imprimer (commentée)
  /*
  const handlePrint = () => {
    if (consultationRef.current) {
      consultationRef.current.classList.add('print-mode');
      window.print();
      setTimeout(() => {
        if (consultationRef.current) {
          consultationRef.current.classList.remove('print-mode');
        }
      }, 1000);
    }
  };
  */

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

  if (!consultation) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <CircleLoader
          loading={false}
          size={50}
          aria-label="Not Found Spinner"
          data-testid="not-found-loader"
        />
        <p className="mt-4 text-gray-600">Consultation non trouvée</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mt-10 mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6 print-hide">
        <h2 className="text-2xl font-bold text-gray-700">Détails de la Consultation</h2>
        <div className="flex gap-3">
          {/*
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-opacity-80"
          >
            Imprimer
          </button>
          */}
          <button
            onClick={handleDownloadPDF}
            className="flex items-center px-4 py-2 bg-primaryColor text-white rounded-lg hover:bg-opacity-80"
          >
            <FaDownload className="mr-2" />
            Télécharger PDF
          </button>
        </div>
      </div>

      <div ref={consultationRef} className="consultation-container">
        {/* En-tête pour impression/PDF */}
        <div className="hidden print-only-header mb-8">
          <h1 className="text-2xl font-bold text-center">Fiche de Consultation</h1>
          <div className="text-center text-gray-600">
            <p>Date: {consultation ? new Date(consultation.date).toLocaleDateString() : ''}</p>
            <p>Numéro de consultation: {id}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Colonne gauche : Date, Antécédents et Douleurs/Cicatrices */}
          <div className="space-y-4">
            <div className="divide-y divide-gray-200">
              <div className="py-3 px-2 rounded-md bg-white">
                <p>
                  <strong>Date :</strong> {new Date(consultation.date).toLocaleDateString()}
                </p>
              </div>
              <div className="py-3 px-2 rounded-md bg-gray-100">
                <p>
                  <strong>Allergies :</strong> {consultation.allergies || 'Aucune'}
                </p>
              </div>
              <div className="py-3 px-2 rounded-md bg-white">
                <p>
                  <strong>Membre artificiel :</strong> {consultation.artificialLimb ? 'Oui' : 'Non'}
                </p>
              </div>
              <div className="py-3 px-2 rounded-md bg-gray-100">
                <p>
                  <strong>Pacemaker :</strong> {consultation.pacemaker ? 'Oui' : 'Non'}
                </p>
              </div>
              <div className="py-3 px-2 rounded-md bg-white">
                <p>
                  <strong>Pression artérielle :</strong> {consultation.bloodPressure || 'N/A'}
                </p>
              </div>
              <div className="py-3 px-2 rounded-md bg-gray-100">
                <p>
                  <strong>Covid/Virus :</strong> {consultation.covidOrVirus || 'Aucun'}
                </p>
              </div>
              <div className="py-3 px-2 rounded-md bg-white">
                <p>
                  <strong>Autre :</strong> {consultation.other || 'Aucun'}
                </p>
              </div>
              <div className="py-3 px-2 rounded-md bg-gray-100">
                <h4 className="text-sm font-medium">Douleurs enregistrées</h4>
                {consultation.painAreas && consultation.painAreas.length > 0 ? (
                  <ul className="list-none pl-0 mt-2">
                    {consultation.painAreas.map((pain, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 py-2 border-b border-gray-200 last:border-b-0"
                      >
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                        <span>
                          {pain.bodyPart} {pain.side ? `(${pain.side})` : ''}: Actuel: {pain.intensity}%, Max: {pain.maxIntensity}%
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-gray-600">Aucune douleur enregistrée.</p>
                )}
              </div>
              <div className="py-3 px-2 rounded-md bg-white">
                <h4 className="text-sm font-medium">Cicatrices enregistrées</h4>
                {consultation.scars && consultation.scars.length > 0 ? (
                  <ul className="list-none pl-0 mt-2">
                    {consultation.scars.map((scar, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 py-2 border-b border-gray-200 last:border-b-0"
                      >
                        <ExclamationCircleIcon className="h-5 w-5 text-blue-500" />
                        <span>{scar.bodyPart}: {scar.description}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-gray-600">Aucune cicatrice enregistrée.</p>
                )}
              </div>
            </div>
          </div>
          {/* Colonne droite : Détails de la consultation */}
          <div className="space-y-4">
            <div className="divide-y divide-gray-200">
              <div className="py-3 px-2 rounded-md bg-white">
                <p>
                  <strong>Motif :</strong> {consultation.consultationReason || 'N/A'}
                </p>
              </div>
              <div className="py-3 px-2 rounded-md bg-gray-100">
                <p>
                  <strong>Observations :</strong> {consultation.practitionerObservations || 'N/A'}
                </p>
              </div>
              <div className="py-3 px-2 rounded-md bg-white">
                <p>
                  <strong>Durée du problème :</strong> {consultation.problemDuration || 'N/A'}
                </p>
              </div>
              <div className="py-3 px-2 rounded-md bg-gray-100">
                <p>
                  <strong>Indication médicale :</strong> {consultation.medicalIndication || 'N/A'}
                </p>
              </div>
              <div className="py-3 px-2 rounded-md bg-white">
                <p>
                  <strong>Médication :</strong> {consultation.medication || 'Aucune'}
                </p>
              </div>
              <div className="py-3 px-2 rounded-md bg-gray-100">
                <p>
                  <strong>Maladie :</strong> {consultation.disease || 'Aucune'}
                </p>
              </div>
              <div className="py-3 px-2 rounded-md bg-white">
                <p>
                  <strong>Traitement :</strong> {consultation.treatmentDetails || 'N/A'}
                </p>
              </div>
              <div className="py-3 px-2 rounded-md bg-gray-100">
                <p>
                  <strong>Commentaire client :</strong> {consultation.clientComment || 'N/A'}
                </p>
              </div>
              <div className="py-3 px-2 rounded-md bg-white">
                <p>
                  <strong>Pourcentage d'amélioration :</strong> {consultation.improvementPercentage}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationDetails;