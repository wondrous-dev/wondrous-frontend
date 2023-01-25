export interface PaymentSelected {
  podId?: string;
  orgId?: string;
  payeeId: string;
  payeeUsername: string;
  payeeProfilePicture?: string;
  taskTitle: string;
  submissionId: string;
  amount: number;
  symbol: string;
}

export interface GrantPaymentSelected {
  podId?: string;
  orgId?: string;
  paymentAddress: string;
  grantTitle: string;
  grantApplicationId: string;
  grantApplicationTitle: string;
  amount: number;
  symbol: string;
}

export interface PayoutTableItem {
  id?: string;
  taskTitle: string;
  taskId: string;
  submissionId: string;
  payeeId: string;
  payeeUsername: string;
  payeeProfilePicture?: string;
  payeeActiveEthAddress?: string;
  submissionApprovedAt?: string;
  payedAt?: string;
  paymentStatus: string;
  chain: string;
  amount: number;
  symbol: string;
  icon?: string;
  tokenName?: string;
  decimal?: number;
  tokenAddress?: string;
  safeAddress?: string;
  txHash?: string;
  safeTxHash?: string;
  additionalData?: {
    manualExplorerLink?: string;
    utopiaLink?: string;
  };
}
