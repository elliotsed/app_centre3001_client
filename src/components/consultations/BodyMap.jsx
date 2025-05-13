import { useState } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import photo from '../../assets/photo.png';
import { ExclamationCircleIcon } from '@heroicons/react/solid';

const BodyMap = ({ painAreas, scars, onUpdate }) => {
  const [painBodyPart, setPainBodyPart] = useState('');
  const [scarBodyPart, setScarBodyPart] = useState('');
  const [painDetails, setPainDetails] = useState({ direction: '', intensity: 0, maxIntensity: 0, side: '' });
  const [scarDescription, setScarDescription] = useState('');
  const [painCustomPart, setPainCustomPart] = useState('');
  const [scarCustomPart, setScarCustomPart] = useState('');
  const [usePainCustomPart, setUsePainCustomPart] = useState(false);
  const [useScarCustomPart, setUseScarCustomPart] = useState(false);
  const [painError, setPainError] = useState('');
  const [scarError, setScarError] = useState('');

  const bodyParts = [
    'Tête', 'Cou', 'Épaule gauche', 'Épaule droite', 'Bras gauche', 'Bras droit',
    'Main gauche', 'Main droite', 'Coude gauche', 'Coude droite', 'Poitrine', 'Dos haut',
    'Dos milieu', 'Dos bas', 'Ventre', 'Hanche gauche', 'Hanche droite', 'Jambe gauche',
    'Jambe droite', 'Genou gauche', 'Genou droite', 'Pied gauche', 'Pied droite', 'Sacrum',
  ];

  const bodyPartOptions = bodyParts.map((part) => ({ value: part, label: part }));

  const addPainArea = () => {
    const part = usePainCustomPart ? painCustomPart : painBodyPart;
    if (!part) {
      setPainError('Veuillez sélectionner ou entrer une partie du corps.');
      return;
    }
    if (painDetails.intensity < 0 || painDetails.maxIntensity < 0) {
      setPainError('Les intensités doivent être supérieures ou égales à 0.');
      return;
    }
    const newPainAreas = [...painAreas, { bodyPart: part, ...painDetails }];
    onUpdate(newPainAreas, scars);
    setPainDetails({ direction: '', intensity: 0, maxIntensity: 0, side: '' });
    setPainBodyPart('');
    setPainCustomPart('');
    setUsePainCustomPart(false);
    setPainError('');
  };

  const addScar = () => {
    const part = useScarCustomPart ? scarCustomPart : scarBodyPart;
    if (!part) {
      setScarError('Veuillez sélectionner ou entrer une partie du corps.');
      return;
    }
    if (!scarDescription) {
      setScarError('Veuillez entrer une description pour la cicatrice.');
      return;
    }
    const newScars = [...scars, { bodyPart: part, description: scarDescription }];
    onUpdate(painAreas, newScars);
    setScarDescription('');
    setScarBodyPart('');
    setScarCustomPart('');
    setUseScarCustomPart(false);
    setScarError('');
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">🧍‍♂️ Visualisation corporelle</h3>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
          <div className="h-64 mt-4 bg-gray-100 rounded flex items-center justify-center">
            <img src={photo} alt="Carte corporelle" />
          </div>
        </div>
        <div className="w-full md:w-1/2 space-y-4">
          {/* Douleurs */}
          <div>
            <h4 className="text-md font-medium">💢 Ajouter une douleur</h4>
            <div className="space-y-2 mt-4">
              <div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={usePainCustomPart}
                    onChange={(e) => setUsePainCustomPart(e.target.checked)}
                    className="h-4 w-4 text-primaryColor border-gray-300 rounded"
                  />
                  <span>Entrer manuellement</span>
                </div>
                {usePainCustomPart ? (
                  <input
                    type="text"
                    value={painCustomPart}
                    onChange={(e) => setPainCustomPart(e.target.value)}
                    placeholder="Ex: Épaule personnalisée"
                    className="w-full p-2 border rounded"
                  />
                ) : (
                  <Select
                    options={bodyPartOptions}
                    value={bodyPartOptions.find((option) => option.value === painBodyPart) || null}
                    onChange={(option) => setPainBodyPart(option ? option.value : '')}
                    placeholder="Rechercher une partie du corps..."
                    isClearable
                    className="w-full mt-2"
                  />
                )}
              </div>
              <div className="flex gap-16">
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
              </div>
              {painError && <p className="text-sm text-red-500">{painError}</p>}
              <button
                type="button"
                onClick={addPainArea}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Ajouter douleur
              </button>
            </div>
          </div>

          {/* Cicatrices */}
          <div>
            <h4 className="text-md font-medium">🩹 Ajouter une cicatrice</h4>
            <div className="space-y-2 mt-4">
              <div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={useScarCustomPart}
                    onChange={(e) => setUseScarCustomPart(e.target.checked)}
                    className="h-4 w-4 text-primaryColor border-gray-300 rounded"
                  />
                  <span>Entrer manuellement</span>
                </div>
                {useScarCustomPart ? (
                  <input
                    type="text"
                    value={scarCustomPart}
                    onChange={(e) => setScarCustomPart(e.target.value)}
                    placeholder="Ex: Abdomen personnalisé"
                    className="w-full p-2 border rounded"
                  />
                ) : (
                  <Select
                    options={bodyPartOptions}
                    value={bodyPartOptions.find((option) => option.value === scarBodyPart) || null}
                    onChange={(option) => setScarBodyPart(option ? option.value : '')}
                    placeholder="Rechercher une partie du corps..."
                    isClearable
                    className="w-full"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm">Description</label>
                <input
                  type="text"
                  value={scarDescription}
                  onChange={(e) => setScarDescription(e.target.value)}
                  placeholder="Ex: Cicatrice chirurgicale"
                  className="w-full p-2 border rounded"
                />
              </div>
              {scarError && <p className="text-sm text-red-500">{scarError}</p>}
              <button
                type="button"
                onClick={addScar}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Ajouter cicatrice
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="text-md font-medium">💢 Douleurs enregistrées</h4>
        {painAreas.length > 0 ? (
          <ul className="list-none mt-3 pl-0">
            {painAreas.map((pain, index) => (
              <li key={index} className="flex items-center gap-2 mb-2">
                <span className="text-red-600">📍</span>
                <span>
                  {pain.bodyPart} {pain.side ? `(${pain.side})` : ''}: Actuel: {pain.intensity}%, Max: {pain.maxIntensity}%
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucune douleur enregistrée.</p>
        )}

        <h4 className="text-md font-medium mt-4">🩹 Cicatrices enregistrées</h4>
        {scars.length > 0 ? (
          <ul className="list-none mt-3 pl-0">
            {scars.map((scar, index) => (
              <li key={index} className="flex items-center gap-2 mb-2">
                <span className="text-blue-600">📍</span>
                <span>{scar.bodyPart}: {scar.description}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucune cicatrice enregistrée.</p>
        )}
      </div>
    </div>
  );
};

BodyMap.propTypes = {
  painAreas: PropTypes.arrayOf(
    PropTypes.shape({
      bodyPart: PropTypes.string.isRequired,
      direction: PropTypes.string,
      intensity: PropTypes.number.isRequired,
      maxIntensity: PropTypes.number.isRequired,
      side: PropTypes.string,
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
