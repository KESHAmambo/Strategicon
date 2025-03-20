export interface DamageRow {
  id: string;
  diceType: string;
  unitSize: number;
  bonus: number;
  rollResult?: number;
  damage?: number;
  color: string;
  isReroll?: boolean;
  rerollTime?: string;
}

export interface HistoryEntry {
  date: string;
  rows: DamageRow[];
} 