import React from 'react';
import { DamageRow } from './types';

interface HistoryEntry {
  date: string;
  rows: DamageRow[];
}

interface HistoryProps {
  history: HistoryEntry[];
  diceMaxValues: Record<string, number>;
}

export const History: React.FC<HistoryProps> = ({ history, diceMaxValues }) => {
  if (history.length === 0) return null;

  return (
    <div className="battle-history">
      <h2>Battle History</h2>
      {history.map((entry, index) => (
        <div key={entry.date} className="history-entry">
          <div className="history-entry-date">
            {entry.date}
          </div>
          <table>
            <thead>
              <tr>
                <th>Dice</th>
                <th>Unit Size</th>
                <th>Bonus</th>
                <th>Roll</th>
                <th>Damage</th>
              </tr>
            </thead>
            <tbody>
              {entry.rows.map(row => (
                <tr key={`${entry.date}-${row.id}`}>
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
                  <td>{row.bonus >= 0 ? `+${row.bonus}` : row.bonus}</td>
                  <td 
                    className="roll-result-cell"
                    style={{
                      '--intensity-color': `${row.color}${Math.floor((row.rollResult! / diceMaxValues[row.diceType]) * 255).toString(16).padStart(2, '0')}`,
                      '--intensity-color-dark': `${row.color}${Math.floor((row.rollResult! / diceMaxValues[row.diceType]) * 200).toString(16).padStart(2, '0')}`
                    } as React.CSSProperties}
                  >
                    {row.rollResult}
                  </td>
                  <td 
                    className="roll-result-cell"
                    style={{
                      '--intensity-color': `${row.color}${row.damage! > diceMaxValues[row.diceType] ? 'ff' : Math.floor((row.damage! / diceMaxValues[row.diceType]) * 255).toString(16).padStart(2, '0')}`,
                      '--intensity-color-dark': `${row.color}${row.damage! > diceMaxValues[row.diceType] ? 'cc' : Math.floor((row.damage! / diceMaxValues[row.diceType]) * 200).toString(16).padStart(2, '0')}`
                    } as React.CSSProperties}
                  >
                    {row.damage}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}; 