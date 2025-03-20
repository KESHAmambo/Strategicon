import React from 'react';
import './History.css';
import { HistoryEntry } from './types';
import { images } from './assets';

interface HistoryProps {
  history: HistoryEntry[];
  diceMaxValues: Record<string, number>;
}

const diceTypes = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'] as const;
type DiceType = typeof diceTypes[number];

export const History: React.FC<HistoryProps> = ({ history, diceMaxValues }) => {
  if (history.length === 0) return null;

  return (
    <div className="battle-history">
      <h2 className='section-title'>
        <img src={images.scroll} alt="History" className="slider-icon scroll-icon" />
        Battle History
      </h2>
      {history.map((entry) => (
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
                    style={row.damage !== undefined && row.rollResult ? {
                      '--intensity-color': `${row.color}${row.damage > diceMaxValues[row.diceType as DiceType] ? 'ff' : Math.floor((row.damage / diceMaxValues[row.diceType as DiceType]) * 255).toString(16).padStart(2, '0')}`,
                      '--intensity-color-dark': `${row.color}${row.damage > diceMaxValues[row.diceType as DiceType] ? 'cc' : Math.floor((row.damage / diceMaxValues[row.diceType as DiceType]) * 200).toString(16).padStart(2, '0')}`
                    } as React.CSSProperties : undefined}
                    data-value={row.damage}
                  >
                    {row.rollResult ? (row.damage === 0 ? '0' : row.damage) : '-'}
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