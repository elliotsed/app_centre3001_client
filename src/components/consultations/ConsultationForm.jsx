import { useState } from 'react';
import PropTypes from 'prop-types';
import BodyMap from './BodyMap';
import { createConsultation } from '../../api/clients';

const ConsultationForm = ({ clientId, onConsultationAdded }) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
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
      alert('Consultation enregistrée avec succès !');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l’enregistrement de la consultation');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <h3 className="text-lg font-semibold">Nouveau Bilan de Consultation</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Allergies</label>
          <input
            type="text"
            name="allergies"
            value={formData.allergies}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Membre artificiel</label>
          <input
            type="checkbox"
            name="artificialLimb"
            checked={formData.artificialLimb}
            onChange={handleChange}
            className="p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Pacemaker</label>
          <input
            type="checkbox"
            name="pacemaker"
            checked={formData.pacemaker}
            onChange={handleChange}
            className="p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Pression artérielle</label>
          <input
            type="text"
            name="bloodPressure"
            value={formData.bloodPressure}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Covid/Virus</label>
          <input
            type="text"
            name="covidOrVirus"
            value={formData.covidOrVirus}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Motif de la consultation</label>
          <textarea
            name="consultationReason"
            value={formData.consultationReason}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Observations du praticien</label>
          <textarea
            name="practitionerObservations"
            value={formData.practitionerObservations}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Durée du problème</label>
          <input
            type="text"
            name="problemDuration"
            value={formData.problemDuration}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Indication médicale</label>
          <input
            type="text"
            name="medicalIndication"
            value={formData.medicalIndication}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Médication</label>
          <input
            type="text"
            name="medication"
            value={formData.medication}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Maladie</label>
          <input
            type="text"
            name="disease"
            value={formData.disease}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Détails du traitement</label>
          <textarea
            name="treatmentDetails"
            value={formData.treatmentDetails}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Commentaire du client</label>
          <textarea
            name="clientComment"
            value={formData.clientComment}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Pourcentage d’amélioration</label>
          <input
            type="number"
            name="improvementPercentage"
            value={formData.improvementPercentage}
            onChange={handleChange}
            min="0"
            max="100"
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
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
      <button
        type="submit"
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Enregistrer la consultation
      </button>
    </form>
  );
};
ConsultationForm.propTypes = {
  clientId: PropTypes.string.isRequired,
  onConsultationAdded: PropTypes.func.isRequired,
};

export default ConsultationForm;
