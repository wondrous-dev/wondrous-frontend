export interface PaymentData {
  tokenAddress: string;
  isEthTransfer: Boolean;
  amount: string;
  recepientAddress: string;
  chain: string;
  decimal: number;
}

export interface SubmissionPaymentInfo {
  submissionId: string;
  paymentData: PaymentData[];
}

export interface GrantApplicationPaymentInfo {
  grantApplicationId: string;
  paymentData: PaymentData[];
}
