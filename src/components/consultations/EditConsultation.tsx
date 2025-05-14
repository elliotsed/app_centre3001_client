import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchConsultation, updateConsultation } from '../../api/clients';
import { toast } from 'react-toastify';
import CircleLoader from 'react-spinners/CircleLoader';
import BodyMap from './BodyMap';
import { GiHamburgerMenu } from 'react-icons/gi';
import { DashboardContext } from '../../pages/Dashboard';
import PropTypes from 'prop-types';
import {
  DocumentIcon,
  UserIcon,
  MapIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/outline';
import React from 'react';

const EditConsultation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleToggleClick } = useContext(DashboardContext);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    allergies: '',
    artificialLimb: false,
    pacemaker: false,
    bloodPressure: '',
    covidOrVirus: '',
    other: '',
    painAreas: [] as { bodyPart: string; side?: string; intensity: number; maxIntensity: number }[],
    scars: [] as { bodyPart: string; description: string }[],
    consultationReason: '',
    practitionerObservations: '',
    problemDuration: '',
    medicalIndication: '',
    medication: '',
    disease: '',
    treatmentDetails: '',
    clientComment: '',
    improvementPercentage: 0,
    clientId: '',
    date: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConsultation = async () => {
      try {
        const consultation = await fetchConsultation(id);
        setFormData({
          allergies: consultation.allergies || '',
          artificialLimb: consultation.artificialLimb || false,
          pacemaker: consultation.pacemaker || false,
          bloodPressure: consultation.bloodPressure || '',
          covidOrVirus: consultation.covidOrVirus || '',
          other: consultation.other || '',
          painAreas: consultation.painAreas || [],
          scars: consultation.scars || [],
          consultationReason: consultation.consultationReason || '',
          practitionerObservations: consultation.practitionerObservations || '',
          problemDuration: consultation.problemDuration || '',
          medicalIndication: consultation.medicalIndication || '',
          medication: consultation.medication || '',
          disease: consultation.disease || '',
          treatmentDetails: consultation.treatmentDetails || '',
          clientComment: consultation.clientComment || '',
          improvementPercentage: consultation.improvementPercentage || 0,
          clientId: consultation.clientId || '',
          date: consultation.date ? new Date(consultation.date).toISOString().split('T')[0] : '',
        });
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Erreur lors de la récupération de la consultation');
        setLoading(false);
      }
    };
    loadConsultation();
  }, [id]);

  // Validation functions
  const validateStepOne = () => {
    const newErrors: { [key: string]: string } = {};
    setErrors(newErrors);
    return true; // All fields optional
  };

  const validateStepTwo = () => {
    const newErrors: { [key: string]: string } = {};
    setErrors(newErrors);
    return true; // Pain areas/scars optional
  };

  const validateStepThree = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.consultationReason) newErrors.consultationReason = 'Le motif de la consultation est requis.';
    if (formData.improvementPercentage < 0 || formData.improvementPercentage > 100) {
      newErrors.improvementPercentage = 'Le pourcentage doit être entre 0 et 100.';
    }
    if (!formData.date) newErrors.date = 'La date est requise.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStepFour = () => {
    return validateStepThree();
  };

  const handleNext = () => {
    let isValid = false;
    if (step === 1) isValid = validateStepOne();
    if (step === 2) isValid = validateStepTwo();
    if (step === 3) isValid = validateStepThree();
    if (step === 4) isValid = validateStepFour();
    if (isValid) setStep((prevStep) => prevStep + 1);
  };

  const handlePrev = () => setStep((prevStep) => prevStep - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStepFour()) {
      if (!formData.clientId) {
        toast.error('ID du client manquant', {
          position: 'top-right',
          autoClose: 5000,
        });
        return;
      }
      try {
        const { clientId, ...consultationData } = formData;
        console.log('Updating consultation:', consultationData);
        await updateConsultation(id, consultationData);
        toast.success('Consultation mise à jour avec succès !', {
          position: 'top-right',
          autoClose: 5000,
        });
        navigate(`/dashboard/clients/${formData.clientId}`);
      } catch (err) {
        console.error('Erreur:', err);
        toast.error(err.message || 'Erreur lors de la mise à jour de la consultation', {
          position: 'top-right',
          autoClose: 5000,
        });
        if (err.message.includes('Non autorisé')) {
          navigate('/login');
        }
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : name === 'improvementPercentage' ? Number(value) : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleBodyMapUpdate = (newPainAreas, newScars) => {
    setFormData((prev) => ({ ...prev, painAreas: newPainAreas, scars: newScars }));
  };

  const handleCancel = () => {
    if (formData.clientId) {
      navigate(`/dashboard/clients/${formData.clientId}`);
    } else {
      toast.error('Impossible de retourner au profil client : ID manquant', {
        position: 'top-right',
        autoClose: 5000,
      });
      navigate('/dashboard');
    }
  };

  const steps = [
    { label: 'Antécédents', icon: <UserIcon className="h-5 w-5" /> },
    { label: 'Douleurs/Cicatrices', icon: <MapIcon className="h-5 w-5" /> },
    { label: 'Consultation', icon: <DocumentIcon className="h-5 w-5" /> },
    { label: 'Résumé', icon: <CheckCircleIcon className="h-5 w-5" /> },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="topbar">
          <div className="toggle" onClick={handleToggleClick}>
            <GiHamburgerMenu />
          </div>
        </div>
        <CircleLoader loading={loading} size={50} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
        {error.includes('Non autorisé') && (
          <button
            onClick={() => navigate('/login')}
            className="mt-4 px-4 py-2 bg-primaryColor text-white rounded-lg hover:bg-opacity-80"
          >
            Se connecter
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white p-8 font-sans mb-10 shadow-md rounded-lg mx-3 lg:mx-10">
      <div className="topbar">
        <div className="toggle" onClick={handleToggleClick}>
          <GiHamburgerMenu />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-700 mb-6">
        Modifier le Bilan de Consultation
      </h2>

      {/* Step Indicator */}
      <div className="flex justify-between border-b font-medium gap-4 mb-8">
        {steps.map((stepData, index) => (
          <div
            key={index}
            className={`flex w-full text-center py-2.5 text-gray-700 justify-center gap-3 items-center ${
              step === index + 1
                ? 'border-b-2 border-primaryColor text-[#057979]'
                : 'text-gray-400'
            }`}
          >
            <div
              className={`flex items-center justify-center p-2 rounded-full ${
                step === index + 1
                  ? 'bg-primaryColor text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {stepData.icon}
            </div>
            <div className="hidden md:flex">{stepData.label}</div>
          </div>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Step 1: Antécédents médicaux */}
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="font-sans font-semibold text-gray-700">
              Antécédents Médicaux
            </h3>
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left: Text Inputs */}
              <div className="flex-1 space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Allergies
                  </label>
                  <input
                    type="text"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg outline-none border-gray-300 focus:ring-2 focus:ring-brightColor"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Pression artérielle
                  </label>
                  <input
                    type="text"
                    name="bloodPressure"
                    value={formData.bloodPressure}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg outline-none border-gray-300 focus:ring-2 focus:ring-brightColor"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Covid/Virus
                  </label>
                  <input
                    type="text"
                    name="covidOrVirus"
                    value={formData.covidOrVirus}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg outline-none border-gray-300 focus:ring-2 focus:ring-brightColor"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Autre
                  </label>
                  <input
                    type="text"
                    name="other"
                    value={formData.other}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg outline-none border-gray-300 focus:ring-2 focus:ring-brightColor"
                  />
                </div>
              </div>
              {/* Right: Checkboxes */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="artificialLimb"
                    checked={formData.artificialLimb}
                    onChange={handleChange}
                    className="h-4 w-4 text-primaryColor border-gray-300 rounded focus:ring-brightColor"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Membre artificiel
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="pacemaker"
                    checked={formData.pacemaker}
                    onChange={handleChange}
                    className="h-4 w-4 text-primaryColor border-gray-300 rounded focus:ring-brightColor"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Pacemaker
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Douleurs et Cicatrices */}
        {step === 2 && (
          <div className="space-y-6">
            <h3 className="font-sans font-semibold text-gray-700">
              Douleurs et Cicatrices
            </h3>
            <BodyMap
              painAreas={formData.painAreas}
              scars={formData.scars}
              onUpdate={handleBodyMapUpdate}
            />
          </div>
        )}

        {/* Step 3: Détails de la Consultation */}
        {step === 3 && (
          <div className="space-y-6">
            <h3 className="font-sans font-semibold text-gray-700">
              Détails de la Consultation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg outline-none ${
                    errors.date
                      ? 'ring-2 ring-red-500'
                      : 'border-gray-300 focus:ring-2 focus:ring-brightColor'
                  }`}
                  required
                />
                {errors.date && (
                  <p className="text-sm text-red-500">{errors.date}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-700">
                  Motif de la consultation
                </label>
                <textarea
                  name="consultationReason"
                  value={formData.consultationReason}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg outline-none ${
                    errors.consultationReason
                      ? 'ring-2 ring-red-500'
                      : 'border-gray-300 focus:ring-2 focus:ring-brightColor'
                  }`}
                  required
                />
                {errors.consultationReason && (
                  <p className="text-sm text-red-500">{errors.consultationReason}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-700">
                  Observations du praticien
                </label>
                <textarea
                  name="practitionerObservations"
                  value={formData.practitionerObservations}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg outline-none border-gray-300 focus:ring-2 focus:ring-brightColor"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-700">
                  Durée du problème
                </label>
                <input
                  type="text"
                  name="problemDuration"
                  value={formData.problemDuration}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg outline-none border-gray-300 focus:ring-2 focus:ring-brightColor"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-700">
                  Indication médicale
                </label>
                <input
                  type="text"
                  name="medicalIndication"
                  value={formData.medicalIndication}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg outline-none border-gray-300 focus:ring-2 focus:ring-brightColor"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-700">
                  Médication
                </label>
                <input
                  type="text"
                  name="medication"
                  value={formData.medication}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg outline-none border-gray-300 focus:ring-2 focus:ring-brightColor"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-700">
                  Maladie
                </label>
                <input
                  type="text"
                  name="disease"
                  value={formData.disease}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg outline-none border-gray-300 focus:ring-2 focus:ring-brightColor"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-700">
                  Détails du traitement
                </label>
                <textarea
                  name="treatmentDetails"
                  value={formData.treatmentDetails}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg outline-none border-gray-300 focus:ring-2 focus:ring-brightColor"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-700">
                  Commentaire du client
                </label>
                <textarea
                  name="clientComment"
                  value={formData.clientComment}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg outline-none border-gray-300 focus:ring-2 focus:ring-brightColor"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-700">
                  Pourcentage d’amélioration
                </label>
                <input
                  type="number"
                  name="improvementPercentage"
                  value={formData.improvementPercentage}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className={`w-full px-4 py-2 border rounded-lg outline-none ${
                    errors.improvementPercentage
                      ? 'ring-2 ring-red-500'
                      : 'border-gray-300 focus:ring-2 focus:ring-brightColor'
                  }`}
                />
                {errors.improvementPercentage && (
                  <p className="text-sm text-red-500">{errors.improvementPercentage}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Résumé */}
        {step === 4 && (
          <div className="space-y-6">
            <h3 className="font-sans font-semibold text-gray-700">
              Résumé de la Consultation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Colonne gauche : Antécédents et Douleurs/Cicatrices */}
              <div className="space-y-4">
                <div className="divide-y divide-gray-200">
                  <div className="py-3 px-2 rounded-md bg-white">
                    <p>
                      <strong>Allergies :</strong> {formData.allergies || 'Aucune'}
                    </p>
                  </div>
                  <div className="py-3 px-2 rounded-md bg-gray-100">
                    <p>
                      <strong>Membre artificiel :</strong> {formData.artificialLimb ? 'Oui' : 'Non'}
                    </p>
                  </div>
                  <div className="py-3 px-2 rounded-md bg-white">
                    <p>
                      <strong>Pacemaker :</strong> {formData.pacemaker ? 'Oui' : 'Non'}
                    </p>
                  </div>
                  <div className="py-3 px-2 rounded-md bg-gray-100">
                    <p>
                      <strong>Pression artérielle :</strong> {formData.bloodPressure || 'N/A'}
                    </p>
                  </div>
                  <div className="py-3 px-2 rounded-md bg-white">
                    <p>
                      <strong>Covid/Virus :</strong> {formData.covidOrVirus || 'Aucun'}
                    </p>
                  </div>
                  <div className="py-3 px-2 rounded-md bg-gray-100">
                    <p>
                      <strong>Autre :</strong> {formData.other || 'Aucun'}
                    </p>
                  </div>
                  <div className="py-3 px-2 rounded-md bg-white">
                    <h4 className="text-sm font-medium">Douleurs enregistrées</h4>
                    {formData.painAreas.length > 0 ? (
                      <ul className="list-none pl-0 mt-2">
                        {formData.painAreas.map((pain, index) => (
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
                  <div className="py-3 px-2 rounded-md bg-gray-100">
                    <h4 className="text-sm font-medium">Cicatrices enregistrées</h4>
                    {formData.scars.length > 0 ? (
                      <ul className="list-none pl-0 mt-2">
                        {formData.scars.map((scar, index) => (
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
                      <strong>Date :</strong> {formData.date || 'N/A'}
                    </p>
                  </div>
                  <div className="py-3 px-2 rounded-md bg-gray-100">
                    <p>
                      <strong>Motif :</strong> {formData.consultationReason || 'N/A'}
                    </p>
                  </div>
                  <div className="py-3 px-2 rounded-md bg-white">
                    <p>
                      <strong>Observations :</strong> {formData.practitionerObservations || 'N/A'}
                    </p>
                  </div>
                  <div className="py-3 px-2 rounded-md bg-gray-100">
                    <p>
                      <strong>Durée du problème :</strong> {formData.problemDuration || 'N/A'}
                    </p>
                  </div>
                  <div className="py-3 px-2 rounded-md bg-white">
                    <p>
                      <strong>Indication médicale :</strong> {formData.medicalIndication || 'N/A'}
                    </p>
                  </div>
                  <div className="py-3 px-2 rounded-md bg-gray-100">
                    <p>
                      <strong>Médication :</strong> {formData.medication || 'Aucune'}
                    </p>
                  </div>
                  <div className="py-3 px-2 rounded-md bg-white">
                    <p>
                      <strong>Maladie :</strong> {formData.disease || 'Aucune'}
                    </p>
                  </div>
                  <div className="py-3 px-2 rounded-md bg-gray-100">
                    <p>
                      <strong>Traitement :</strong> {formData.treatmentDetails || 'N/A'}
                    </p>
                  </div>
                  <div className="py-3 px-2 rounded-md bg-white">
                    <p>
                      <strong>Commentaire client :</strong> {formData.clientComment || 'N/A'}
                    </p>
                  </div>
                  <div className="py-3 px-2 rounded-md bg-gray-100">
                    <p>
                      <strong>Pourcentage d’amélioration :</strong> {formData.improvementPercentage}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-opacity-80"
            >
              Annuler
            </button>
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Précédent
              </button>
            )}
          </div>
          {step < 4 && (
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 bg-primaryColor text-white rounded-lg hover:bg-opacity-80"
            >
              Suivant
            </button>
          )}
          {step === 4 && (
            <button
              type="submit"
              className="px-4 py-2 bg-primaryColor text-white rounded-lg hover:bg-opacity-80"
            >
              Enregistrer la consultation
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

EditConsultation.propTypes = {
  id: PropTypes.string,
};

export default EditConsultation;