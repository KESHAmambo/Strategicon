import React, { useState, useEffect } from 'react';
import { images } from './assets';
import './StartScreen.css';

interface StartScreenProps {
  onStart: (colors: string[]) => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [players, setPlayers] = useState([
    { color: '#1c6eff' },
    { color: '#139c00' }
  ]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    document.documentElement.style.setProperty('--background-image', `url(${images.background})`);
  }, []);

  const handleColorChange = (index: number, color: string) => {
    const newColors = [...players.map(p => p.color)];
    newColors[index] = color;
    setPlayers(players.map((p, i) => ({ ...p, color: newColors[i] })));
    validateColors(newColors);
  };

  const validateColors = (colorArray: string[]) => {
    const uniqueColors = new Set(colorArray);
    if (uniqueColors.size !== colorArray.length) {
      setError('All players must have different colors');
    } else {
      setError('');
    }
  };

  const handleAddPlayer = () => {
    setPlayers([...players, { color: '#dc2626' }]);
  };

  const handleRemovePlayer = (index: number) => {
    if (players.length <= 2) {
      setError('Minimum 2 players required');
      return;
    }
    setPlayers(players.filter((_, i) => i !== index));
    validateColors(players.filter((_, i) => i !== index).map(p => p.color));
  };

  const handleStart = () => {
    if (players.length < 2) {
      setError('Minimum 2 players required');
      return;
    }
    const uniqueColors = new Set(players.map(p => p.color));
    if (uniqueColors.size !== players.length) {
      setError('All players must have different colors');
      return;
    }
    onStart(players.map(p => p.color));
  };

  return (
    <div className="start-screen in-root-container">
      <div className="start-screen-content">
        <div className="color-picker-section">
          <div className="section-header">
            <h2>Choose Players Colors</h2>
            <button 
              className="add-player-button"
              onClick={handleAddPlayer}
            >
              <img src={images.user} alt="Add Player" />
            </button>
          </div>
          <div className="color-pickers">
            {players.map((player, index) => (
              <div key={index} className="color-picker">
                <label>
                  Player {index + 1}
                  {players.length > 2 && (
                    <button 
                      className="remove-player-button"
                      onClick={() => handleRemovePlayer(index)}
                    >
                      ✕
                    </button>
                  )}
                </label>
                <input
                  type="color"
                  value={player.color}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                />
                <div 
                  className="color-preview" 
                  style={{ backgroundColor: player.color }}
                />
              </div>
            ))}
          </div>
          {error && <div className="error-message">{error}</div>}
        </div>
        <button 
          className="start-button"
          onClick={handleStart}
        >
          <img src={images.hexagon} alt="Start" />
          Start Strategicon!
        </button>
      </div>
    </div>
  );
}; 