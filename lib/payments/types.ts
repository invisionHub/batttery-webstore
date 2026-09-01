export interface InitializePaymentInput {
  email: string;
  amount: number;
  reference: string;
  callbackUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface InitializePaymentResult {
  ok: boolean;
  authorizationUrl?: string;
  accessCode?: string;
  reference?: string;
  message?: string;
  raw?: unknown;
}

export interface VerifyPaymentResult {
  ok: boolean;
  reference?: string;
  status?: 'success' | 'failed' | 'abandoned' | 'pending' | string;
  amount?: number;
  currency?: string;
  customer?: {
    email?: string;
  };
  message?: string;
  raw?: unknown;
}

export interface PaymentProvider {
  initialize(input: InitializePaymentInput): Promise<InitializePaymentResult>;
  verify(reference: string): Promise<VerifyPaymentResult>;
}
