import React, { useState } from 'react'
import './App.css'

interface DamageRow {
  id: string;
  diceType: string;
  unitSize: number;
  bonus: number;
  rollResult?: number;
  damage?: number;
}

function App() {
  const diceTypes = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'];
  const [rows, setRows] = useState<DamageRow[]>([]);
  const [isAddingRow, setIsAddingRow] = useState(false);
  const [lastRollTime, setLastRollTime] = useState<string | null>(null);
  const [newRow, setNewRow] = useState<Partial<DamageRow>>({
    diceType: 'd6',
    unitSize: 1,
    bonus: 0
  });

  const handleAddRow = () => {
    if (newRow.diceType && newRow.unitSize && newRow.bonus !== undefined) {
      const row: DamageRow = {
        id: Date.now().toString(),
        diceType: newRow.diceType,
        unitSize: newRow.unitSize,
        bonus: newRow.bonus
      };
      setRows([...rows, row]);
      setIsAddingRow(false);
      setNewRow({
        diceType: 'd6',
        unitSize: 1,
        bonus: 0
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
      console.log(`R (Roll Result) = ${roll}`);
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

  return (
    <div className="container">
      <h1>Damage Calculator</h1>
      
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Dice</th>
              <th>Unit Size</th>
              <th>Bonus</th>
              <th>Roll Result</th>
              <th>Damage</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.id}>
                <td>{row.diceType}</td>
                <td>{row.unitSize}</td>
                <td>{row.bonus}</td>
                <td>{row.rollResult || '-'}</td>
                <td>{row.damage || '-'}</td>
                <td>
                  <button 
                    className="delete-button"
                    onClick={() => handleDeleteRow(row.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isAddingRow ? (
          <div className="add-row-form">
            <h3>Add New Row</h3>
            <div className="form-group">
              <label>Dice Type:</label>
              <select
                value={newRow.diceType}
                onChange={(e) => setNewRow({ ...newRow, diceType: e.target.value })}
              >
                {diceTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Unit Size:</label>
              <input
                type="number"
                min="1"
                value={newRow.unitSize}
                onChange={(e) => setNewRow({ ...newRow, unitSize: parseInt(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label>Bonus:</label>
              <input
                type="number"
                value={newRow.bonus}
                onChange={(e) => setNewRow({ ...newRow, bonus: parseInt(e.target.value) })}
                placeholder="Can be negative"
              />
            </div>
            <div className="form-actions">
              <button onClick={handleAddRow}>Add Row</button>
              <button onClick={() => setIsAddingRow(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <button 
            className="add-row-button"
            onClick={() => setIsAddingRow(true)}
          >
            Add New Row
          </button>
        )}

        {rows.length > 0 && (
          <div className="roll-section">
            <button 
              className="roll-button"
              onClick={handleRoll}
            >
              Roll All
            </button>
            {lastRollTime && (
              <div className="last-roll-time">
                Last roll: {lastRollTime}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App 