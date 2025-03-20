export interface DamageRow {
  id: string;
  diceType: string;
  unitSize: number;
  bonus: number;
  rollResult?: number;
  damage?: number;
  color: string;
}

export interface HistoryEntry {
  date: string;
  rows: DamageRow[];
} 