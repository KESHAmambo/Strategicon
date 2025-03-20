import React from 'react';
import { HistoryEntry } from './types';
import './TotalStats.css';
import { images } from './assets';

interface TotalStatsProps {
  history: HistoryEntry[];
  playerColors: string[];
}

interface PlayerStats {
  color: string;
  battles: number;
  units: number;
  totalSize: number;
  totalDamage: number;
}

export const TotalStats: React.FC<TotalStatsProps> = ({ history, playerColors }) => {
  const calculatePlayerStats = (): PlayerStats[] => {
    const stats: Record<string, PlayerStats> = {};
    
    // Initialize stats for each player
    playerColors.forEach(color => {
      stats[color] = {
        color,
        battles: 0,
        units: 0,
        totalSize: 0,
        totalDamage: 0
      };
    });

    // Calculate stats from history
    history.forEach(entry => {
      const battleColors = new Set(entry.rows.map(row => row.color));
      battleColors.forEach(color => {
        stats[color].battles++;
      });

      entry.rows.forEach(row => {
        if (!row.isReroll) {
          stats[row.color].units++;
          stats[row.color].totalSize += row.unitSize;
          stats[row.color].totalDamage += row.damage || 0;
        }
      });
    });

    return Object.values(stats);
  };

  const playerStats = calculatePlayerStats();

  // Function to get the best value for a specific stat
  const getBestValue = (statKey: keyof Omit<PlayerStats, 'color'>): number => {
    return Math.max(...playerStats.map(stat => stat[statKey]));
  };

  // Function to check if a value is the best
  const isBestValue = (value: number, statKey: keyof Omit<PlayerStats, 'color'>): boolean => {
    return value === getBestValue(statKey);
  };

  // Function to get the best average size
  const getBestAvgSize = (): number => {
    return Math.max(...playerStats.map(stat => 
      stat.units > 0 ? Math.round(stat.totalSize / stat.units) : 0
    ));
  };

  // Function to check if average size is the best
  const isBestAvgSize = (units: number, totalSize: number): boolean => {
    const avgSize = units > 0 ? Math.round(totalSize / units) : 0;
    return avgSize === getBestAvgSize();
  };

  return (
    <div className="total-stats">
      <h2 className='section-title stats-title'>
        <img src={images.stats} alt="Statistics" className="slider-icon scroll-icon" />
        History Stats
      </h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Player</th>
              <th>Battles</th>
              <th>Units</th>
              <th>Total Size</th>
              <th>Avg Size</th>
              <th>Total Damage</th>
            </tr>
          </thead>
          <tbody>
            {playerStats.map(stat => (
              <tr key={stat.color}>
                <td>
                  <div className="player-color" style={{ backgroundColor: stat.color }} />
                </td>
                <td className={isBestValue(stat.battles, 'battles') ? 'best-value' : ''} 
                    style={isBestValue(stat.battles, 'battles') ? { backgroundColor: `${stat.color}80`, fontWeight: 'bold' } : undefined}>
                  {stat.battles}
                </td>
                <td className={isBestValue(stat.units, 'units') ? 'best-value' : ''} 
                    style={isBestValue(stat.units, 'units') ? { backgroundColor: `${stat.color}80`, fontWeight: 'bold' } : undefined}>
                  {stat.units}
                </td>
                <td className={isBestValue(stat.totalSize, 'totalSize') ? 'best-value' : ''} 
                    style={isBestValue(stat.totalSize, 'totalSize') ? { backgroundColor: `${stat.color}80`, fontWeight: 'bold' } : undefined}>
                  {stat.totalSize}
                </td>
                <td className={isBestAvgSize(stat.units, stat.totalSize) ? 'best-value' : ''} 
                    style={isBestAvgSize(stat.units, stat.totalSize) ? { backgroundColor: `${stat.color}80`, fontWeight: 'bold' } : undefined}>
                  {stat.units > 0 ? Math.round(stat.totalSize / stat.units) : 0}
                </td>
                <td className={isBestValue(stat.totalDamage, 'totalDamage') ? 'best-value' : ''} 
                    style={isBestValue(stat.totalDamage, 'totalDamage') ? { backgroundColor: `${stat.color}80`, fontWeight: 'bold' } : undefined}>
                  {stat.totalDamage}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 