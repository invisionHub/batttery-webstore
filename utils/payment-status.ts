export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REVERSED' | 'REFUNDED';

export interface Payment {
  id?: string;
  status: PaymentStatus;
  [key: string]: unknown;
}

export class InvalidPaymentTransitionError extends Error {
  constructor(from: PaymentStatus, to: PaymentStatus) {
    super(`Invalid payment transition: ${from} -> ${to}`);
    this.name = 'InvalidPaymentTransitionError';
  }
}

/**
 * Payment lifecycle policy.
 *
 * Reasoning:
 * - A payment starts in PENDING.
 * - It can only succeed or fail from PENDING.
 * - A successful payment can later be reversed or refunded.
 * - Final states (FAILED, REVERSED, REFUNDED) are terminal and should not move forward.
 * - This prevents impossible flows such as FAILED -> SUCCESS or PENDING -> REVERSED.
 */
export const TRANSITIONS: Record<PaymentStatus, PaymentStatus[]> = {
  PENDING: ['SUCCESS', 'FAILED'],
  SUCCESS: ['REVERSED', 'REFUNDED'],
  FAILED: [],
  REVERSED: [],
  REFUNDED: [],
};

export function canTransition(from: PaymentStatus, to: PaymentStatus): boolean {
  return TRANSITIONS[from].includes(to);
}

export function transition<T extends Payment>(
  payment: T,
  to: PaymentStatus
): T & { status: PaymentStatus } {
  if (!canTransition(payment.status, to)) {
    throw new InvalidPaymentTransitionError(payment.status, to);
  }

  return {
    ...payment,
    status: to,
  };
}
