export interface ContributeProject {
  id: string;
  title: string;
  slug: string;
  target_units: number;
  unit_label: string;
  unit_price_ghs: number;
}

export type PayMethod = 'MOMO' | 'CARD' | 'BANK';

export type RecognitionType = 'full' | 'first' | 'anon';

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

export const PAY_METHODS: {
  key: PayMethod;
  label: string;
  logos: string;
  activeColor: string;
  activeBg: string;
  activeRing: string;
}[] = [
  {
    key: 'MOMO',
    label: 'Mobile Money',
    logos: 'MTN · Vodafone · AirtelTigo',
    activeColor: 'text-yellow-700',
    activeBg: 'bg-yellow-50',
    activeRing: 'ring-yellow-400/30 border-yellow-300',
  },
  {
    key: 'CARD',
    label: 'Card Payment',
    logos: 'Visa · Mastercard',
    activeColor: 'text-blue-700',
    activeBg: 'bg-blue-50',
    activeRing: 'ring-blue-400/30 border-blue-300',
  },
  {
    key: 'BANK',
    label: 'Bank Transfer',
    logos: 'Direct bank payment',
    activeColor: 'text-emerald-700',
    activeBg: 'bg-emerald-50',
    activeRing: 'ring-emerald-400/30 border-emerald-300',
  },
];

export const PRESETS = [10, 50, 100, 200, 500, 1000];