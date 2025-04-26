import { useState } from 'react';
import PropTypes from 'prop-types';
import photo from '../../assets/photo.png';
import { ExclamationCircleIcon } from '@heroicons/react/solid';

const BodyMap = ({ painAreas, scars, onUpdate }) => {
  const [selectedPart, setSelectedPart] = useState('');
  const [painDetails, setPainDetails] = useState({ direction: '', intensity: 0, maxIntensity: 0 });

  const bodyParts = [
    'Tête', 'Cou', 'Épaule gauche', 'Épaule droite', 'Bras gauche', 'Bras droit',
    'Poitrine', 'Dos', 'Ventre', 'Hanche gauche', 'Hanche droite', 'Jambe gauche', 'Jambe droite',
  ];

  const addPainArea = () => {
    if (selectedPart && painDetails.intensity >= 0 && painDetails.maxIntensity >= 0) {
      const newPainAreas = [...painAreas, { bodyPart: selectedPart, ...painDetails }];
      onUpdate(newPainAreas, scars);
      setPainDetails({ direction: '', intensity: 0, maxIntensity: 0 });
      setSelectedPart('');
    }
  };


  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Visualisation corporelle</h3>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
          <div className="h-64 mt-4 bg-gray-100 rounded flex items-center justify-center">
           <img src={photo} alt=""/>
          </div>
        </div>
        <div className="w-full md:w-1/2 space-y-4">
          <div>
            <label className="block text-sm font-medium">Partie du corps</label>
            <select
              value={selectedPart}
              onChange={(e) => setSelectedPart(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Sélectionner</option>
              {bodyParts.map((part) => (
                <option key={part} value={part}>{part}</option>
              ))}
            </select>
          </div>
          <div>
            <h4 className="text-sm font-medium">Ajouter une douleur</h4>
            <div className="space-y-2">
              {/* <div>
                <label className="block text-sm">Direction de la douleur</label>
                <input
                  type="text"
                  value={painDetails.direction}
                  onChange={(e) => setPainDetails({ ...painDetails, direction: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div> */}
              <div>
                <label className="block text-sm">Intensité actuelle (%)</label>
                <input
                  type="number"
                  value={painDetails.intensity}
                  onChange={(e) => setPainDetails({ ...painDetails, intensity: Number(e.target.value) })}
                  min="0"
                  max="100"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm">Intensité maximale (%)</label>
                <input
                  type="number"
                  value={painDetails.maxIntensity}
                  onChange={(e) => setPainDetails({ ...painDetails, maxIntensity: Number(e.target.value) })}
                  min="0"
                  max="100"
                  className="w-full p-2 border rounded"
                />
              </div>
              <button
                type="button"
                onClick={addPainArea}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Ajouter douleur
              </button>
            </div>
          </div>
          {/* <div>
            <h4 className="text-sm font-medium">Ajouter une cicatrice</h4>
            <div className="space-y-2">
              <div>
                <label className="block text-sm">Description</label>
                <input
                  type="text"
                  value={scarDescription}
                  onChange={(e) => setScarDescription(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <button
                type="button"
                onClick={addScar}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Ajouter cicatrice
              </button>
            </div>
          </div> */}
        </div>
      </div>
      <div className="mt-4">
        <h4 className="text-md font-medium">Douleurs enregistrées</h4>
        {painAreas.length > 0 ? (
         <ul className="list-none mt-3 pl-0">
            {painAreas.map((pain, index) => (
              <li key={index} className="flex items-center gap-2 mb-2">
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                
                <span>
                  {pain.bodyPart}: {pain.direction}, Actuel: {pain.intensity}%, Max: {pain.maxIntensity}%
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucune douleur enregistrée.</p>
        )}
        {/* <h4 className="text-sm font-medium mt-2">Cicatrices enregistrées</h4>
        {scars.length > 0 ? (
          <ul className="list-disc pl-5">
            {scars.map((scar, index) => (
              <li key={index}>{scar.bodyPart}: {scar.description}</li>
            ))}
          </ul>
        ) : (
          <p>Aucune cicatrice enregistrée.</p>
        )} */}
      </div>
    </div>
  );
};
BodyMap.propTypes = {
  painAreas: PropTypes.arrayOf(
    PropTypes.shape({
      bodyPart: PropTypes.string.isRequired,
      direction: PropTypes.string.isRequired,
      intensity: PropTypes.number.isRequired,
      maxIntensity: PropTypes.number.isRequired,
    })
  ).isRequired,
  scars: PropTypes.arrayOf(
    PropTypes.shape({
      bodyPart: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default BodyMap;
