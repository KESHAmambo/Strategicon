import React, { useState } from 'react';
import './StartScreen.css';

interface StartScreenProps {
  onStart: (colors: string[]) => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [colors, setColors] = useState<string[]>(['#ff0000', '#0000ff']);
  const [error, setError] = useState<string>('');

  const handleColorChange = (index: number, color: string) => {
    const newColors = [...colors];
    newColors[index] = color;
    setColors(newColors);
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
    setColors([...colors, '#000000']);
  };

  const handleRemovePlayer = (index: number) => {
    if (colors.length <= 2) {
      setError('Minimum 2 players required');
      return;
    }
    const newColors = colors.filter((_, i) => i !== index);
    setColors(newColors);
    validateColors(newColors);
  };

  const handleStart = () => {
    if (colors.length < 2) {
      setError('Minimum 2 players required');
      return;
    }
    const uniqueColors = new Set(colors);
    if (uniqueColors.size !== colors.length) {
      setError('All players must have different colors');
      return;
    }
    onStart(colors);
  };

  return (
    <div className="start-screen">
      <div className="start-screen-content">
        <div className="color-picker-section">
          <div className="section-header">
            <h2>Choose Players Colors</h2>
            <button 
              className="add-player-button"
              onClick={handleAddPlayer}
            >
              <img src="/src/static/user.png" alt="Add Player" />
            </button>
          </div>
          <div className="color-pickers">
            {colors.map((color, index) => (
              <div key={index} className="color-picker">
                <label>
                  Player {index + 1}
                  {colors.length > 2 && (
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
                  value={color}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                />
                <div 
                  className="color-preview" 
                  style={{ backgroundColor: color }}
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
          <img src="/src/static/hexagon.png" alt="Start" />
          Start Strategicon
        </button>
      </div>
    </div>
  );
}; 