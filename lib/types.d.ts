export interface BillItem {
  id: string;
  name: string;
  qty: number;
  unitPrice: number;
  notes?: string;
}

export interface BillData {
  table: {
    id: string;
    name: string;
    server: string;
  };
  currency: string;
  items: BillItem[];
}