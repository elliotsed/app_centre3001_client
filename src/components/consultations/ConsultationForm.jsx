import { useState } from 'react';
import PropTypes from 'prop-types';
import BodyMap from './BodyMap';
import { createConsultation } from '../../api/clients';
import { toast } from 'react-toastify';
import {
  DocumentIcon,
  UserIcon,
  MapIcon,
  CheckCircleIcon,
ExclamationCircleIcon } from '@heroicons/react/outline';

const ConsultationForm = ({ clientId, onConsultationAdded }) => {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    allergies: '',
    artificialLimb: false,
    pacemaker: false,
    bloodPressure: '',
    covidOrVirus: '',
    painAreas: [],
    scars: [],
    consultationReason: '',
    practitionerObservations: '',
    problemDuration: '',
    medicalIndication: '',
    medication: '',
    disease: '',
    treatmentDetails: '',
    clientComment: '',
    improvementPercentage: 0,
  });

  // Validation functions for each step
  const validateStepOne = () => {
    const newErrors = {};
    if (!formData.allergies) newErrors.allergies = 'Les allergies sont requises (ou "Aucune").';
    if (!formData.bloodPressure) newErrors.bloodPressure = 'La pression artérielle est requise (ou "Normale").';
    if (!formData.covidOrVirus) newErrors.covidOrVirus = 'Le statut Covid/Virus est requis (ou "Aucun").';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStepTwo = () => {
    const newErrors = {};
    if (formData.painAreas.length === 0 && formData.scars.length === 0) {
      newErrors.painAreas = 'Ajoutez au moins une douleur ou une cicatrice.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStepThree = () => {
    const newErrors = {};
    if (!formData.consultationReason) newErrors.consultationReason = 'Le motif de la consultation est requis.';
    if (!formData.practitionerObservations) newErrors.practitionerObservations = 'Les observations sont requises (ou "Aucune").';
    if (!formData.problemDuration) newErrors.problemDuration = 'La durée du problème est requise.';
    if (formData.improvementPercentage < 0 || formData.improvementPercentage > 100) {
      newErrors.improvementPercentage = 'Le pourcentage doit être entre 0 et 100.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStepFour = () => {
    return validateStepOne() && validateStepTwo() && validateStepThree();
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
      try {
        console.log('Submitting consultation:', { clientId, ...formData });
        const response = await createConsultation({ clientId, ...formData });
        if (response instanceof Error) throw response;
        onConsultationAdded(response);
        setFormData({
          allergies: '',
          artificialLimb: false,
          pacemaker: false,
          bloodPressure: '',
          covidOrVirus: '',
          painAreas: [],
          scars: [],
          consultationReason: '',
          practitionerObservations: '',
          problemDuration: '',
          medicalIndication: '',
          medication: '',
          disease: '',
          treatmentDetails: '',
          clientComment: '',
          improvementPercentage: 0,
        });
        setStep(1);
        toast.success('Consultation enregistrée avec succès !', {
          position: 'top-right',
          autoClose: 5000,
        });
      } catch (error) {
        console.error('Erreur:', error);
        toast.error('Erreur lors de l’enregistrement de la consultation', {
          position: 'top-right',
          autoClose: 5000,
        });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const steps = [
    { label: 'Antécédents', icon: <UserIcon className="h-5 w-5" /> },
    { label: 'Douleurs/Cicatrices', icon: <MapIcon className="h-5 w-5" /> },
    { label: 'Consultation', icon: <DocumentIcon className="h-5 w-5" /> },
    { label: 'Résumé', icon: <CheckCircleIcon className="h-5 w-5" /> },
  ];

  return (
    <div className="bg-white p-8 font-sans mb-10 shadow-md rounded-lg mx-3 lg:mx-10">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">
        Nouveau Bilan de Consultation
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
                    className={`w-full px-4 py-2 border rounded-lg outline-none ${
                      errors.allergies
                        ? 'ring-2 ring-red-500'
                        : 'border-gray-300 focus:ring-2 focus:ring-brightColor'
                    }`}
                  />
                  {errors.allergies && (
                    <p className="text-sm text-red-500">{errors.allergies}</p>
                  )}
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
                    className={`w-full px-4 py-2 border rounded-lg outline-none ${
                      errors.bloodPressure
                        ? 'ring-2 ring-red-500'
                        : 'border-gray-300 focus:ring-2 focus:ring-brightColor'
                    }`}
                  />
                  {errors.bloodPressure && (
                    <p className="text-sm text-red-500">{errors.bloodPressure}</p>
                  )}
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
                    className={`w-full px-4 py-2 border rounded-lg outline-none ${
                      errors.covidOrVirus
                        ? 'ring-2 ring-red-500'
                        : 'border-gray-300 focus:ring-2 focus:ring-brightColor'
                    }`}
                  />
                  {errors.covidOrVirus && (
                    <p className="text-sm text-red-500">{errors.covidOrVirus}</p>
                  )}
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
              onUpdate={(newPainAreas, newScars) =>
                setFormData({
                  ...formData,
                  painAreas: newPainAreas,
                  scars: newScars,
                })
              }
            />
            {errors.painAreas && (
              <p className="text-sm text-red-500">{errors.painAreas}</p>
            )}
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
                  className={`w-full px-4 py-2 border rounded-lg outline-none ${
                    errors.practitionerObservations
                      ? 'ring-2 ring-red-500'
                      : 'border-gray-300 focus:ring-2 focus:ring-brightColor'
                  }`}
                />
                {errors.practitionerObservations && (
                  <p className="text-sm text-red-500">{errors.practitionerObservations}</p>
                )}
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
                  className={`w-full px-4 py-2 border rounded-lg outline-none ${
                    errors.problemDuration
                      ? 'ring-2 ring-red-500'
                      : 'border-gray-300 focus:ring-2 focus:ring-brightColor'
                  }`}
                />
                {errors.problemDuration && (
                  <p className="text-sm text-red-500">{errors.problemDuration}</p>
                )}
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
                  <div className="py-3 px-2 rounded-md   bg-gray-100">
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
                              {pain.bodyPart}: {pain.direction}, Actuel: {pain.intensity}%, Max: {pain.maxIntensity}%
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
                      <strong>Motif :</strong> {formData.consultationReason || 'N/A'}
                    </p>
                  </div>
                  <div className="py-3 px-2 rounded-md bg-gray-100">
                    <p>
                      <strong>Observations :</strong> {formData.practitionerObservations || 'N/A'}
                    </p>
                  </div>
                  <div className="py-3 px-2 rounded-md bg-white">
                    <p>
                      <strong>Durée du problème :</strong> {formData.problemDuration || 'N/A'}
                    </p>
                  </div>
                  <div className="py-3 px-2 rounded-md bg-gray-100">
                    <p>
                      <strong>Indication médicale :</strong> {formData.medicalIndication || 'N/A'}
                    </p>
                  </div>
                  <div className="py-3 px-2 rounded-md bg-white">
                    <p>
                      <strong>Médication :</strong> {formData.medication || 'Aucune'}
                    </p>
                  </div>
                  <div className="py-3 px-2 rounded-md bg-gray-100">
                    <p>
                      <strong>Maladie :</strong> {formData.disease || 'Aucune'}
                    </p>
                  </div>
                  <div className="py-3 px-2 rounded-md bg-white">
                    <p>
                      <strong>Traitement :</strong> {formData.treatmentDetails || 'N/A'}
                    </p>
                  </div>
                  <div className="py-3 px-2 rounded-md bg-gray-100">
                    <p>
                      <strong>Commentaire client :</strong> {formData.clientComment || 'N/A'}
                    </p>
                  </div>
                  <div className="py-3 px-2 rounded-md bg-white">
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
          {step > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            >
              Précédent
            </button>
          )}
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

ConsultationForm.propTypes = {
  clientId: PropTypes.string.isRequired,
  onConsultationAdded: PropTypes.func.isRequired,
};

export default ConsultationForm;