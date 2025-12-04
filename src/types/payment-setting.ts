import type { Timestamps } from './index';

export interface PaymentSetting extends Timestamps {
  id: string;
  organizationId: string;
  autoWithdrawEnabled: boolean;
  autoWithdrawThreshold?: number;
  defaultWithdrawalAddressId?: string;
}

export interface PaymentSettingResponse {
  paymentSetting: PaymentSetting;
}

