export enum Selection {
  All = 'all',
}

export const INITIAL_SELECTION_OPTIONS = [{ label: 'Select all payments', value: Selection.All }];

export enum PAYMENT_TYPES {
  PAID = 'paid',
  PROCESSING = 'processing',
  UNPAID = 'unpaid',
}
