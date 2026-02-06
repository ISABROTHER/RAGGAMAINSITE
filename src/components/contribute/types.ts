export interface ContributeProject {
  id: string;
  title: string;
  slug: string;
  target_units: number;
  unit_label: string;
  unit_price_ghs: number;
}

export type PayMethod = 'MOMO' | 'CARD' | 'BANK';

export interface ContributionData {
  amount: number;
  firstName: string;
  lastName: string;
  contact: string;
  payMethod: PayMethod;
  totalGHS: number;
  totalUSD: number;
  reference: string;
}

export const PAY_METHODS: { key: PayMethod; label: string; sublabel: string; color: string; activeClass: string }[] = [
  { key: 'MOMO', label: 'Mobile Money', sublabel: 'MTN, Vodafone, AirtelTigo', color: 'text-yellow-600', activeClass: 'border-yellow-400 bg-yellow-50 ring-2 ring-yellow-400/20' },
  { key: 'CARD', label: 'Card', sublabel: 'Visa, Mastercard', color: 'text-blue-600', activeClass: 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20' },
  { key: 'BANK', label: 'Bank Transfer', sublabel: 'Direct bank payment', color: 'text-slate-600', activeClass: 'border-slate-400 bg-slate-50 ring-2 ring-slate-400/20' },
];

export const PRESETS = [50, 200, 500, 1000, 5000, 10000];
