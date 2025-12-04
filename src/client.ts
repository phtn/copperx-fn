import { HTTPClient } from './utils/http';
import type { CopperxConfig } from './types';
import { createAuthResource } from './resources/auth';
import { createStorageResource } from './resources/storage';
import { createOrganizationResource } from './resources/organization';
import { createUsersResource } from './resources/users';
import { createWithdrawalAddressesResource } from './resources/withdrawal-addresses';
import { createPaymentSettingResource } from './resources/payment-setting';
import { createInvoiceSettingResource } from './resources/invoice-setting';
import { createUserInvitesResource } from './resources/user-invites';
import { createCheckoutSessionsResource } from './resources/checkout-sessions';
import { createPaymentLinksResource } from './resources/payment-links';
import { createPricesResource } from './resources/prices';
import { createProductsResource } from './resources/products';
import { createSubscriptionsResource } from './resources/subscriptions';
import { createInvoicesResource } from './resources/invoices';
import { createCustomersResource } from './resources/customers';
import { createTransactionsResource } from './resources/transactions';
import { createAssetsResource } from './resources/assets';
import { createChainsResource } from './resources/chains';
import { createPaymentIntentsResource } from './resources/payment-intents';
import { createCouponsResource } from './resources/coupons';
import { createTaxRatesResource } from './resources/tax-rates';
import { createConstantsResource } from './resources/constants';
import { createWebhooksResource } from './resources/webhooks';
import { createPartnerResource } from './resources/partner';

export class CopperxClient {
  private readonly httpClient: HTTPClient;

  public readonly auth: ReturnType<typeof createAuthResource>;
  public readonly storage: ReturnType<typeof createStorageResource>;
  public readonly organization: ReturnType<typeof createOrganizationResource>;
  public readonly users: ReturnType<typeof createUsersResource>;
  public readonly withdrawalAddresses: ReturnType<
    typeof createWithdrawalAddressesResource
  >;
  public readonly paymentSetting: ReturnType<
    typeof createPaymentSettingResource
  >;
  public readonly invoiceSetting: ReturnType<
    typeof createInvoiceSettingResource
  >;
  public readonly userInvites: ReturnType<typeof createUserInvitesResource>;
  public readonly checkoutSessions: ReturnType<
    typeof createCheckoutSessionsResource
  >;
  public readonly paymentLinks: ReturnType<typeof createPaymentLinksResource>;
  public readonly prices: ReturnType<typeof createPricesResource>;
  public readonly products: ReturnType<typeof createProductsResource>;
  public readonly subscriptions: ReturnType<
    typeof createSubscriptionsResource
  >;
  public readonly invoices: ReturnType<typeof createInvoicesResource>;
  public readonly customers: ReturnType<typeof createCustomersResource>;
  public readonly transactions: ReturnType<typeof createTransactionsResource>;
  public readonly assets: ReturnType<typeof createAssetsResource>;
  public readonly chains: ReturnType<typeof createChainsResource>;
  public readonly paymentIntents: ReturnType<
    typeof createPaymentIntentsResource
  >;
  public readonly coupons: ReturnType<typeof createCouponsResource>;
  public readonly taxRates: ReturnType<typeof createTaxRatesResource>;
  public readonly constants: ReturnType<typeof createConstantsResource>;
  public readonly webhooks: ReturnType<typeof createWebhooksResource>;
  public readonly partner: ReturnType<typeof createPartnerResource>;

  constructor(config: CopperxConfig) {
    if (!config.apiKey) {
      throw new Error('API key is required');
    }

    this.httpClient = new HTTPClient({
      apiKey: config.apiKey,
      baseURL: config.baseURL,
      timeout: config.timeout,
    });

    this.auth = createAuthResource(this.httpClient);
    this.storage = createStorageResource(this.httpClient);
    this.organization = createOrganizationResource(this.httpClient);
    this.users = createUsersResource(this.httpClient);
    this.withdrawalAddresses = createWithdrawalAddressesResource(
      this.httpClient
    );
    this.paymentSetting = createPaymentSettingResource(this.httpClient);
    this.invoiceSetting = createInvoiceSettingResource(this.httpClient);
    this.userInvites = createUserInvitesResource(this.httpClient);
    this.checkoutSessions = createCheckoutSessionsResource(this.httpClient);
    this.paymentLinks = createPaymentLinksResource(this.httpClient);
    this.prices = createPricesResource(this.httpClient);
    this.products = createProductsResource(this.httpClient);
    this.subscriptions = createSubscriptionsResource(this.httpClient);
    this.invoices = createInvoicesResource(this.httpClient);
    this.customers = createCustomersResource(this.httpClient);
    this.transactions = createTransactionsResource(this.httpClient);
    this.assets = createAssetsResource(this.httpClient);
    this.chains = createChainsResource(this.httpClient);
    this.paymentIntents = createPaymentIntentsResource(this.httpClient);
    this.coupons = createCouponsResource(this.httpClient);
    this.taxRates = createTaxRatesResource(this.httpClient);
    this.constants = createConstantsResource(this.httpClient);
    this.webhooks = createWebhooksResource(this.httpClient);
    this.partner = createPartnerResource(this.httpClient);
  }
}
