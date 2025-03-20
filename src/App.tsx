import React, { useState, useEffect } from 'react'
import './App.css'
import { StartScreen } from './StartScreen'

interface DamageRow {
  id: string;
  diceType: string;
  unitSize: number;
  bonus: number;
  rollResult?: number;
  damage?: number;
  color: string;
}

function App() {
  const diceTypes = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'] as const;
  type DiceType = typeof diceTypes[number];

  const diceMaxValues: Record<DiceType, number> = {
    d4: 4,
    d6: 6,
    d8: 8,
    d10: 10,
    d12: 12,
    d20: 20,
  };

  const [isGameStarted, setIsGameStarted] = useState(false);
  const [playerColors, setPlayerColors] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [rows, setRows] = useState<DamageRow[]>([]);
  const [lastRollTime, setLastRollTime] = useState<string | null>(null);
  const [newRow, setNewRow] = useState<Partial<DamageRow>>(() => {
    const initialDiceType = 'd6' as DiceType;
    const maxValue = diceMaxValues[initialDiceType];
    const averageValue = Math.floor((maxValue + 1) / 2);
    return {
      diceType: initialDiceType,
      unitSize: averageValue,
      bonus: 0,
    };
  });

  // Set first color as selected when playerColors changes
  useEffect(() => {
    if (playerColors.length > 0 && !selectedColor) {
      setSelectedColor(playerColors[0]);
    }
  }, [playerColors]);

  const handleStart = (colors: string[]) => {
    setPlayerColors(colors);
    setIsGameStarted(true);
  };

  const handleAddRow = () => {
    if (newRow.diceType && newRow.unitSize && newRow.bonus !== undefined && selectedColor) {
      setRows([
        ...rows,
        {
          id: Date.now().toString(),
          diceType: newRow.diceType,
          unitSize: newRow.unitSize,
          bonus: newRow.bonus,
          damage: 0,
          color: selectedColor,
        },
      ]);
      const maxValue = diceMaxValues[newRow.diceType as DiceType];
      const averageValue = Math.floor((maxValue + 1) / 2);
      setNewRow({
        diceType: newRow.diceType,
        unitSize: averageValue,
        bonus: newRow.bonus,
      });
    }
  };

  const handleRoll = () => {
    const updatedRows = rows.map(row => {
      const diceMax = parseInt(row.diceType.substring(1));
      const roll = Math.floor(Math.random() * diceMax) + 1;
      
      // Calculate damage
      const damage = Math.floor(
        row.unitSize * (1 + (roll - diceMax) / (roll + diceMax - 2 + row.unitSize/2))
      );

      // Log the formula with actual values
      console.log(`Damage calculation for ${row.diceType}:`);
      console.log(`N (Unit Size) = ${row.unitSize}`);
      console.log(`R (Roll) = ${roll}`);
      console.log(`M (Max Dice Value) = ${diceMax}`);
      console.log(`Formula: Math.floor(${row.unitSize} * (1 + (${roll} - ${diceMax}) / (${roll} + ${diceMax} - 2 + ${row.unitSize}/2)))`);
      console.log(`Result: ${damage}`);
      console.log('-------------------');

      return { ...row, rollResult: roll, damage };
    });
    setRows(updatedRows);
    setLastRollTime(new Date().toLocaleString());
  };

  const handleDeleteRow = (id: string) => {
    setRows(rows.filter(row => row.id !== id));
  };

  const handleDiceTypeSelect = (type: DiceType) => {
    const maxValue = diceMaxValues[type];
    const averageValue = Math.floor((maxValue + 1) / 2); // Average of 1 to maxValue, rounded down
    setNewRow(prev => ({ 
      ...prev, 
      diceType: type,
      unitSize: averageValue
    }));
  };

  if (!isGameStarted) {
    return <StartScreen onStart={handleStart} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="player-colors">
          {playerColors.map((color, index) => (
            <button
              key={index}
              className={`dice-button ${selectedColor === color ? 'selected' : ''}`}
              aria-label={`Player ${index + 1}`}
              onClick={() => setSelectedColor(color)}
            >
              <div 
                className="color-indicator" 
                style={{ backgroundColor: color }}
              />
            </button>
          ))}
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mb-8">
          <div className="space-y-4">
            <div>
              <div className="dice-selection-grid">
                {diceTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleDiceTypeSelect(type as DiceType)}
                    className={`dice-button ${newRow.diceType === type ? 'selected' : ''}`}
                  >
                    <div className="dice-image-container">
                      <img
                        src={`/src/static/${type}.png`}
                        alt={type}
                        className="dice-image"
                      />
                      {selectedColor && (
                        <div 
                          className="dice-overlay"
                          style={{ backgroundColor: selectedColor }}
                        />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="slider-container">
              <label>
                <img src="/src/static/unit_size.png" alt="Unit Size" className="slider-icon" />
                Unit Size
              </label>
              <div className="range-input-container">
                <div className="range-ticks">
                  {Array.from(
                    { length: (newRow.diceType ? diceMaxValues[newRow.diceType as DiceType] : 6) - 1 + 1 },
                    (_, i) => i + 1
                  ).map((value) => (
                    <div key={value} className="range-tick" style={{ left: `${(value - 1) / ((newRow.diceType ? diceMaxValues[newRow.diceType as DiceType] : 6) - 1) * 100}%` }}>
                      <span className="range-tick-label">{value}</span>
                    </div>
                  ))}
                </div>
                <input
                  type="range"
                  min="1"
                  max={newRow.diceType ? diceMaxValues[newRow.diceType as DiceType] : 6}
                  value={newRow.unitSize}
                  onChange={(e) =>
                    setNewRow({ ...newRow, unitSize: Number(e.target.value) })
                  }
                  className="range-input"
                  style={{ '--thumb-color': selectedColor || '#b91c1c' } as React.CSSProperties}
                />
              </div>
            </div>
            <div className="slider-container">
              <label>
                <img src="/src/static/bonus.png" alt="Bonus" className="slider-icon" />
                Bonus
              </label>
              <div className="range-input-container">
                <div className="range-ticks">
                  {Array.from(
                    { length: 21 }, // -10 to 10
                    (_, i) => i - 10
                  ).map((value) => (
                    <div key={value} className="range-tick" style={{ left: `${(value + 10) / 20 * 100}%` }}>
                      <span className="range-tick-label">{value}</span>
                    </div>
                  ))}
                </div>
                <input
                  type="range"
                  min="-10"
                  max="10"
                  value={newRow.bonus}
                  onChange={(e) =>
                    setNewRow({ ...newRow, bonus: Number(e.target.value) })
                  }
                  className="range-input"
                  style={{ '--thumb-color': selectedColor || '#b91c1c' } as React.CSSProperties}
                />
              </div>
            </div>
          </div>
          <div className="button-container">
            <button
              className="add-row-button"
              onClick={handleAddRow}
              disabled={!newRow.diceType || !selectedColor}
              style={{ backgroundColor: selectedColor || '#d1d5db' }}
            >
              <img src="/src/static/join.png" alt="Join" />
              Join Battle
            </button>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Dice</th>
                <th>Unit Size</th>
                <th>Bonus</th>
                <th>Roll</th>
                <th>Damage</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.id}>
                  <td>
                    <div className="dice-image-container">
                      <img 
                        src={`/src/static/${row.diceType}.png`} 
                        alt={row.diceType}
                        className="table-dice-image"
                      />
                      <div 
                        className="dice-overlay"
                        style={{ backgroundColor: row.color }}
                      />
                    </div>
                  </td>
                  <td>{row.unitSize}</td>
                  <td>{row.bonus}</td>
                  <td 
                    className="roll-result-cell"
                    style={row.rollResult ? {
                      '--intensity-color': `${row.color}${Math.floor((row.rollResult / diceMaxValues[row.diceType as DiceType]) * 255).toString(16).padStart(2, '0')}`,
                      '--intensity-color-dark': `${row.color}${Math.floor((row.rollResult / diceMaxValues[row.diceType as DiceType]) * 200).toString(16).padStart(2, '0')}`
                    } as React.CSSProperties : undefined}
                    data-value={row.rollResult}
                  >
                    {row.rollResult || '-'}
                  </td>
                  <td 
                    className="roll-result-cell"
                    style={row.damage !== undefined ? {
                      '--intensity-color': `${row.color}${Math.floor((row.damage / (diceMaxValues[row.diceType as DiceType])) * 255).toString(16).padStart(2, '0')}`,
                      '--intensity-color-dark': `${row.color}${Math.floor((row.damage / (diceMaxValues[row.diceType as DiceType])) * 200).toString(16).padStart(2, '0')}`
                    } as React.CSSProperties : undefined}
                    data-value={row.damage}
                  >
                    {row.damage === 0 ? '0' : row.damage || '-'}
                  </td>
                  <td>
                    <button 
                      className="delete-button"
                      onClick={() => handleDeleteRow(row.id)}
                    >
                      <img src="/src/static/close.png" alt="Delete" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {rows.length > 0 && (
          <div className="roll-section">
            <button 
              className="roll-button"
              onClick={handleRoll}
            >
              <img src="/src/static/battle.png" alt="Battle" />
              Battle!
            </button>
            {lastRollTime && (
              <div className="last-roll-time">
                Last battle: {lastRollTime}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App 