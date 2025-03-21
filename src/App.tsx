import React, { useState, useEffect } from 'react'
import './App.css'
import { StartScreen } from './StartScreen'
import { History } from './History'
import { TotalStats } from './TotalStats'
import { DamageRow, HistoryEntry } from './types'
import { images } from './assets'

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
  const [isBattleStarted, setIsBattleStarted] = useState(false);
  const [battleTime, setBattleTime] = useState<string | null>(null);
  const [playerColors, setPlayerColors] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [rows, setRows] = useState<DamageRow[]>([]);
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
  const [battleHistory, setBattleHistory] = useState<HistoryEntry[]>([]);

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
      // If in "New Battle" state and table is not empty, save to history and reset
      if (isBattleStarted && rows.length > 0) {
        // Save current results to history
        setBattleHistory(prev => [{
          date: battleTime || new Date().toLocaleString(),
          rows: rows
        }, ...prev]);
        
        // Reset table and add new row
        setRows([{
          id: Date.now().toString(),
          diceType: newRow.diceType,
          unitSize: newRow.unitSize,
          bonus: newRow.bonus,
          color: selectedColor,
        }]);
        setIsBattleStarted(false);
        setBattleTime(null);
      } else {
        // Normal add row behavior
        setRows([
          ...rows,
          {
            id: Date.now().toString(),
            diceType: newRow.diceType,
            unitSize: newRow.unitSize,
            bonus: newRow.bonus,
            color: selectedColor,
          },
        ]);
      }

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
    setIsBattleStarted(true);
    setBattleTime(new Date().toLocaleString());
    const updatedRows = rows.map(row => {
      const diceMax = parseInt(row.diceType.substring(1));
      const roll = Math.floor(Math.random() * diceMax) + 1;
      const rawTotal = roll + row.bonus;
      
      let totalRoll = rawTotal;
      let bonusOverflow = 0;
      
      if (rawTotal > diceMax) {
        totalRoll = diceMax;
        bonusOverflow = rawTotal - diceMax;
      } else if (rawTotal < 1) {
        totalRoll = 1;
        bonusOverflow = rawTotal - 1;
      }

      const baseDamage = Math.floor(
        row.unitSize * (1 + (totalRoll - diceMax) / (totalRoll + diceMax - 2 + row.unitSize/2))
      );

      const damageWithBonus = baseDamage + bonusOverflow;

      let maxDamage = row.unitSize;
      if (row.diceType === 'd6') {
        maxDamage = row.unitSize + 1;
      } else if (row.diceType === 'd8' || row.diceType === 'd10') {
        maxDamage = row.unitSize + 2;
      } else if (row.diceType === 'd12' || row.diceType === 'd20') {
        maxDamage = row.unitSize + 3;
      }

      const damage = Math.max(0, Math.min(damageWithBonus, maxDamage));

      return { ...row, rollResult: roll, damage };
    });

    setRows(updatedRows);
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

  const handleReroll = (row: DamageRow) => {
    setBattleTime(new Date().toLocaleString());
    const diceMax = parseInt(row.diceType.substring(1));
    const roll = Math.floor(Math.random() * diceMax) + 1;
    const rawTotal = roll + row.bonus;
    
    let totalRoll = rawTotal;
    let bonusOverflow = 0;
    
    if (rawTotal > diceMax) {
      totalRoll = diceMax;
      bonusOverflow = rawTotal - diceMax;
    } else if (rawTotal < 1) {
      totalRoll = 1;
      bonusOverflow = rawTotal - 1;
    }

    const baseDamage = Math.floor(
      row.unitSize * (1 + (totalRoll - diceMax) / (totalRoll + diceMax - 2 + row.unitSize/2))
    );

    const damageWithBonus = baseDamage + bonusOverflow;

    let maxDamage = row.unitSize;
    if (row.diceType === 'd6') {
      maxDamage = row.unitSize + 1;
    } else if (row.diceType === 'd8' || row.diceType === 'd10') {
      maxDamage = row.unitSize + 2;
    } else if (row.diceType === 'd12' || row.diceType === 'd20') {
      maxDamage = row.unitSize + 3;
    }

    const damage = Math.max(0, Math.min(damageWithBonus, maxDamage));

    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    // Create a new row with the old values
    const oldRow = {
      ...row,
      id: `${row.id}-${Date.now()}`,
      isReroll: true,
      rerollTime: timeString
    };

    // Update the current row with new values
    const updatedRow = {
      ...row,
      rollResult: roll,
      damage
    };

    // Find the index of the current row
    const rowIndex = rows.findIndex(r => r.id === row.id);
    
    setRows(prevRows => {
      const newRows = [...prevRows];
      // Replace the current row with updated values
      newRows[rowIndex] = updatedRow;
      // Insert the old row right after the current row (at the beginning of reroll group)
      newRows.splice(rowIndex + 1, 0, oldRow);
      return newRows;
    });
  };

  if (!isGameStarted) {
    return <StartScreen onStart={handleStart} />;
  }

  return (
    <div className="in-root-container min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
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
                        src={images[type]}
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
                <img src={images.unit_size} alt="Unit Size" className="slider-icon" />
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
                <img src={images.bonus} alt="Bonus" className="slider-icon" />
                Bonus
              </label>
              <div className="range-input-container">
                <div className="range-ticks">
                  {Array.from(
                    { length: 17 }, // -10 to 10
                    (_, i) => i - 5
                  ).map((value) => (
                    <div key={value} className="range-tick" style={{ left: `${(value + 5) / 16 * 100}%` }}>
                      <span className="range-tick-label">{value}</span>
                    </div>
                  ))}
                </div>
                <input
                  type="range"
                  min="-5"
                  max="11"
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
              className="add-dice-button"
              onClick={handleAddRow}
              disabled={!newRow.diceType || !selectedColor}
              style={{ backgroundColor: selectedColor || '#d1d5db' }}
            >
              <img 
                src={isBattleStarted || rows.length === 0 ? images.new_battle : images.join} 
                alt={isBattleStarted || rows.length === 0 ? "New Battle" : "Add Dice"} 
              />
              {isBattleStarted || rows.length === 0 ? "New Battle" : "Add Dice"}
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
                <tr key={row.id} className={row.isReroll ? 'rerolled-row' : ''}>
                  <td>
                    {row.isReroll ? (
                      <div className="dice-image-container">
                        <div className="empty-dice-image" />
                      </div>
                    ) : (
                      <div className="dice-image-container">
                        <img 
                          src={images[row.diceType as keyof typeof images]} 
                          alt={row.diceType}
                          className="table-dice-image"
                        />
                        <div 
                          className="dice-overlay"
                          style={{ backgroundColor: row.color }}
                        />
                      </div>
                    )}
                  </td>
                  <td>{row.isReroll ? '-' : row.unitSize}</td>
                  <td>{row.isReroll ? '-' : row.bonus}</td>
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
                    style={row.damage !== undefined && row.rollResult ? {
                      '--intensity-color': `${row.color}${row.damage > diceMaxValues[row.diceType as DiceType] ? 'ff' : Math.floor((row.damage / diceMaxValues[row.diceType as DiceType]) * 255).toString(16).padStart(2, '0')}`,
                      '--intensity-color-dark': `${row.color}${row.damage > diceMaxValues[row.diceType as DiceType] ? 'cc' : Math.floor((row.damage / diceMaxValues[row.diceType as DiceType]) * 200).toString(16).padStart(2, '0')}`
                    } as React.CSSProperties : undefined}
                    data-value={row.damage}
                  >
                    {row.rollResult ? (row.damage === 0 ? '0' : row.damage) : '-'}
                  </td>
                  <td>
                    {row.isReroll ? (
                      <div className="reroll-time">
                        {row.rerollTime}
                      </div>
                    ) : (
                      <div className="action-buttons">
                        {isBattleStarted && (
                          <button 
                            className="reroll-button"
                            onClick={() => handleReroll(row)}
                          >
                            <img src={images.reroll} alt="Reroll" />
                          </button>
                        )}
                        {!isBattleStarted && (
                          <button 
                            className="delete-button"
                            onClick={() => handleDeleteRow(row.id)}
                          >
                            <img src={images.close} alt="Delete" />
                          </button>
                        )}
                      </div>
                    )}
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
              disabled={isBattleStarted || rows.every(row => row.color === rows[0].color)}
            >
              <img src={images.battle} alt="Battle" />
              Battle!
            </button>
          </div>
        )}

        <History history={battleHistory} diceMaxValues={diceMaxValues} />
        <TotalStats history={battleHistory} playerColors={playerColors} />
      </div>
    </div>
  )
}

export default App 