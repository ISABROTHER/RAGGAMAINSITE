/// <reference types="vite/client" />

declare module '@paystack/inline-js' {
  interface TransactionOptions {
    key: string;
    email: string;
    amount: number;
    currency?: string;
    reference?: string;
    channels?: string[];
    metadata?: Record<string, unknown>;
    onSuccess?: (response: { reference: string; [key: string]: unknown }) => void;
    onCancel?: () => void;
    onError?: (error: unknown) => void;
  }

  export default class Paystack {
    newTransaction(options: TransactionOptions): void;
  }
}
