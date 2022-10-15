export enum SELECTION {
  All = 'all',
}

export const INITIAL_SELECTION_OPTIONS = [{ label: 'Select all payments', value: SELECTION.All }];

export enum PAYMENT_TYPES {
  PAID = 'paid',
  PROCESSING = 'processing',
  UNPAID = 'unpaid',
}
