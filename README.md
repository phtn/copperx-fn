# Copper-X Pure Function SDK

![Tests](https://github.com/phtn/copperx-fn/actions/workflows/test.yml/badge.svg)

A pure function, type-safe TypeScript client SDK for the [Copperx API](https://copperx.readme.io/). Built with Bun and designed for modern TypeScript projects.

## Features

- **Pure Functions**: All methods are pure functions with predictable inputs and outputs
- **Type-Safe**: Full TypeScript support with strict typing and zero `any` types
- **Modern**: Built with Bun runtime and ESM modules
- **Complete**: Covers all Copperx API endpoints
- **Error Handling**: Custom error classes for better error handling
- **Clean API**: Client instance pattern with organized resource methods
- **Battle Tested**: Used in production by multiple companies

## Installation

```bash
bun add copperx-fn
```

Or with npm/yarn/pnpm:

```bash
npm install copperx-fn
# or
yarn add copperx-fn
# or
pnpm add copperx-fn
```

## Quick Start

```typescript
import { CopperxClient } from 'copperx-fn';

// Initialize the client
const client = new CopperxClient({
  apiKey: 'your-api-key-here',
});

// Get current user
const { user } = await client.auth.me();
console.log('Logged in as:', user.email);
```

## Configuration

```typescript
import { CopperxClient } from 'copperx-fn';

const client = new CopperxClient({
  apiKey: process.env.COPPERX_API_KEY!, // Required
  baseURL: 'https://api.copperx.dev/api/v1', // Optional, defaults to production
  timeout: 30000, // Optional, defaults to 30000ms
});
```

## Usage Examples

### Authentication

```typescript
// Get current authenticated user
const { user } = await client.auth.me();
console.log(user.email, user.role);

// Get points token
const { token } = await client.auth.getPointsToken({ points: 100 });
```

### Customers

```typescript
// Create a customer
const { customer } = await client.customers.create({
  email: 'customer@example.com',
  name: 'John Doe',
  phone: '+1234567890',
  address: {
    line1: '123 Main St',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'US',
  },
  metadata: {
    source: 'website',
  },
});

// List customers with pagination
const { data, pagination } = await client.customers.list({
  page: 1,
  limit: 20,
  search: 'john',
});

// Get a specific customer
const { customer: foundCustomer } = await client.customers.get(customer.id);

// Update a customer
const { customer: updatedCustomer } = await client.customers.update(
  customer.id,
  {
    name: 'Jane Doe',
    phone: '+1987654321',
  }
);

// Delete a customer
await client.customers.delete(customer.id);
```

### Checkout Sessions

```typescript
// Create a checkout session
const { checkoutSession } = await client.checkoutSessions.create({
  amount: 10000, // Amount in smallest currency unit (e.g., cents)
  currency: 'USD',
  customerId: customer.id,
  successUrl: 'https://yoursite.com/success',
  cancelUrl: 'https://yoursite.com/cancel',
  metadata: {
    orderId: '12345',
  },
});

// List checkout sessions
const { data: sessions } = await client.checkoutSessions.list({
  status: 'completed',
  customerId: customer.id,
  page: 1,
  limit: 10,
});

// Get a checkout session
const { checkoutSession: session } = await client.checkoutSessions.get(
  checkoutSession.id
);

// Get checkout session status
const { status } = await client.checkoutSessions.getStatus(checkoutSession.id);

// Recover checkout session by transaction hash
const { checkoutSession: recovered } =
  await client.checkoutSessions.recover(checkoutSession.id, {
    transactionHash: '0x...',
  });

// Complete checkout session with incomplete payment
const { checkoutSession: completed } =
  await client.checkoutSessions.complete(checkoutSession.id, {
    transactionHash: '0x...',
  });
```

### Payment Links

```typescript
// Create a payment link
const { paymentLink } = await client.paymentLinks.create({
  name: 'Premium Plan',
  description: 'Monthly subscription',
  amount: 2999,
  currency: 'USD',
  successUrl: 'https://yoursite.com/success',
  cancelUrl: 'https://yoursite.com/cancel',
});

// List payment links
const { data: links } = await client.paymentLinks.list({
  isActive: true,
});

// Get a payment link
const { paymentLink: link } = await client.paymentLinks.get(paymentLink.id);

// Update a payment link
const { paymentLink: updated } = await client.paymentLinks.update(
  paymentLink.id,
  {
    amount: 3999,
    description: 'Updated description',
  }
);

// Activate/deactivate a payment link
await client.paymentLinks.activate(paymentLink.id);
await client.paymentLinks.deactivate(paymentLink.id);

// Delete a payment link
await client.paymentLinks.delete(paymentLink.id);
```

### Products & Prices

```typescript
// Create a product
const { product } = await client.products.create({
  name: 'Premium Subscription',
  description: 'Monthly premium access',
  image: 'https://example.com/image.png',
  metadata: {
    category: 'subscription',
  },
});

// Create a price for the product
const { price } = await client.prices.create({
  productId: product.id,
  amount: 2999,
  currency: 'USD',
  type: 'recurring',
  interval: 'month',
  intervalCount: 1,
});

// List products
const { data: products } = await client.products.list({
  isActive: true,
  search: 'premium',
});

// List prices
const { data: prices } = await client.prices.list({
  productId: product.id,
  type: 'recurring',
});

// Update product
const { product: updatedProduct } = await client.products.update(product.id, {
  name: 'Premium Plus',
  description: 'Updated description',
});

// Activate/deactivate product
await client.products.activate(product.id);
await client.products.deactivate(product.id);
```

### Invoices

```typescript
// Create an invoice
const { invoice } = await client.invoices.create({
  customerId: customer.id,
  lineItems: [
    {
      description: 'Premium Subscription',
      quantity: 1,
      unitAmount: 2999,
    },
    {
      description: 'Setup Fee',
      quantity: 1,
      unitAmount: 500,
    },
  ],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  metadata: {
    invoiceNumber: 'INV-001',
  },
});

// List invoices
const { data: invoices } = await client.invoices.list({
  customerId: customer.id,
  status: 'open',
});

// Get an invoice
const { invoice: foundInvoice } = await client.invoices.get(invoice.id);

// Update a draft invoice
const { invoice: updatedInvoice } = await client.invoices.update(invoice.id, {
  lineItems: [
    {
      description: 'Premium Subscription',
      quantity: 2,
      unitAmount: 2999,
    },
  ],
});

// Finalize an invoice
const { invoice: finalized } = await client.invoices.finalize(invoice.id);

// Send invoice to customer
const { invoice: sent } = await client.invoices.send(invoice.id, {
  email: customer.email,
});

// Mark invoice as paid
const { invoice: paid } = await client.invoices.markPaid(invoice.id, {
  transactionHash: '0x...',
  paidAt: new Date().toISOString(),
});

// Void an invoice
const { invoice: voided } = await client.invoices.void(invoice.id);

// Mark invoice as uncollectible
const { invoice: uncollectible } =
  await client.invoices.markUncollectible(invoice.id);

// Duplicate an invoice
const { invoice: duplicate } = await client.invoices.duplicate(invoice.id);

// Delete a draft invoice
await client.invoices.delete(invoice.id);
```

### Subscriptions

```typescript
// List subscriptions
const { data: subscriptions } = await client.subscriptions.list({
  customerId: customer.id,
  status: 'active',
});

// Get a subscription
const { subscription } = await client.subscriptions.get(subscriptionId);

// Cancel a subscription (at period end)
const { subscription: cancelled } = await client.subscriptions.cancel(
  subscriptionId,
  {
    cancelAtPeriodEnd: true,
  }
);

// Cancel immediately
const { subscription: cancelledNow } =
  await client.subscriptions.cancelImmediately(subscriptionId);

// Resume a cancelled subscription
const { subscription: resumed } = await client.subscriptions.resume(
  subscriptionId
);
```

### Transactions

```typescript
// List transactions
const { data: transactions } = await client.transactions.list({
  type: 'payment',
  status: 'completed',
  customerId: customer.id,
  page: 1,
  limit: 50,
});
```

### Coupons

```typescript
// Create a coupon
const { coupon } = await client.coupons.create({
  code: 'SUMMER2024',
  name: 'Summer Sale',
  type: 'percentage',
  value: 20, // 20% off
  maxRedemptions: 100,
  validFrom: new Date().toISOString(),
  validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
});

// List coupons
const { data: coupons } = await client.coupons.list({
  status: 'active',
});

// Get a coupon
const { coupon: foundCoupon } = await client.coupons.get(coupon.id);

// Update a coupon
const { coupon: updated } = await client.coupons.update(coupon.id, {
  maxRedemptions: 200,
});

// Enable/disable/archive a coupon
await client.coupons.enable(coupon.id);
await client.coupons.disable(coupon.id);
await client.coupons.archive(coupon.id);
```

### Tax Rates

```typescript
// Create a tax rate
const { taxRate } = await client.taxRates.create({
  name: 'Sales Tax',
  rate: 8.5, // 8.5%
  description: 'Standard sales tax',
});

// List tax rates
const { data: taxRates } = await client.taxRates.list({
  isActive: true,
});

// Get a tax rate
const { taxRate: foundTaxRate } = await client.taxRates.get(taxRate.id);

// Update a tax rate
const { taxRate: updated } = await client.taxRates.update(taxRate.id, {
  rate: 9.0,
});

// Activate/deactivate a tax rate
await client.taxRates.activate(taxRate.id);
await client.taxRates.deactivate(taxRate.id);
```

### Webhooks

```typescript
// Create a webhook endpoint
const { webhookEndpoint } = await client.webhooks.create({
  url: 'https://yoursite.com/webhooks/copperx',
  events: ['checkout.session.completed', 'invoice.paid'],
});

// List webhook endpoints
const { data: webhooks } = await client.webhooks.list({
  isActive: true,
});

// Get a webhook endpoint
const { webhookEndpoint: webhook } = await client.webhooks.get(
  webhookEndpoint.id
);

// Update a webhook endpoint
const { webhookEndpoint: updated } = await client.webhooks.update(
  webhookEndpoint.id,
  {
    events: ['checkout.session.completed', 'invoice.paid', 'invoice.voided'],
    isActive: true,
  }
);

// Regenerate webhook secret
const { webhookEndpoint: regenerated } =
  await client.webhooks.regenerateSecret(webhookEndpoint.id);

// Test a webhook
const { success } = await client.webhooks.test(webhookEndpoint.id, {
  event: 'checkout.session.completed',
  payload: {
    id: 'test-id',
    status: 'completed',
  },
});

// Delete a webhook endpoint
await client.webhooks.delete(webhookEndpoint.id);
```

### Assets & Chains

```typescript
// List assets
const { data: assets } = await client.assets.list({
  chainId: 'ethereum',
});

// Get an asset
const { asset } = await client.assets.get(assetId);

// List chains
const { data: chains } = await client.chains.list();

// Get a chain
const { chain } = await client.chains.get(chainId);
```

### Withdrawal Addresses

```typescript
// Create a withdrawal address
const { withdrawalAddress } = await client.withdrawalAddresses.create({
  address: '0x...',
  label: 'Main Wallet',
  chainId: 'ethereum',
});

// List withdrawal addresses
const { data: addresses } = await client.withdrawalAddresses.list();

// Get a withdrawal address
const { withdrawalAddress: address } = await client.withdrawalAddresses.get(
  withdrawalAddress.id
);

// Update a withdrawal address
const { withdrawalAddress: updated } =
  await client.withdrawalAddresses.update(withdrawalAddress.id, {
    label: 'Updated Label',
  });

// Mark as default
const { withdrawalAddress: defaultAddress } =
  await client.withdrawalAddresses.markAsDefault(withdrawalAddress.id);

// Delete a withdrawal address
await client.withdrawalAddresses.delete(withdrawalAddress.id);
```

### Organization

```typescript
// Get organization info
const { organization } = await client.organization.get();

// Update branding
const { organization: updated } = await client.organization.updateBranding({
  primaryColor: '#007bff',
  secondaryColor: '#6c757d',
  logo: 'https://example.com/logo.png',
});

// Delete brand logo
await client.organization.deleteBrandLogo();
```

### Storage

```typescript
// Upload a file
const file = new File(['content'], 'filename.txt', { type: 'text/plain' });
const { url, key } = await client.storage.uploadFile('images', {
  file,
  filename: 'custom-filename.txt',
});

// Or with Buffer (Node.js/Bun)
import { Buffer } from 'buffer';
const buffer = Buffer.from('file content');
const { url: bufferUrl } = await client.storage.uploadFile('documents', {
  file: buffer,
  filename: 'document.pdf',
});
```

## Error Handling

The SDK provides custom error classes for better error handling:

```typescript
import {
  CopperxError,
  CopperxAPIError,
  CopperxAuthenticationError,
  CopperxValidationError,
  CopperxNetworkError,
} from 'copperx-fn';

try {
  const { customer } = await client.customers.create({
    email: 'invalid-email', // Missing required fields
  });
} catch (error) {
  if (error instanceof CopperxValidationError) {
    console.error('Validation error:', error.message);
    console.error('Details:', error.details);
  } else if (error instanceof CopperxAuthenticationError) {
    console.error('Authentication failed:', error.message);
  } else if (error instanceof CopperxAPIError) {
    console.error('API error:', error.message);
    console.error('Status code:', error.statusCode);
    console.error('Error code:', error.code);
  } else if (error instanceof CopperxNetworkError) {
    console.error('Network error:', error.message);
  } else {
    console.error('Unknown error:', error);
  }
}
```

## TypeScript Support

The SDK is fully typed. All types are exported for use in your code:

```typescript
import type {
  Customer,
  Invoice,
  CheckoutSession,
  PaymentLink,
  Product,
  Price,
  Subscription,
  // ... and many more
} from 'copperx-fn';

// Use types in your functions
async function processCustomer(customer: Customer) {
  console.log(customer.email);
  // TypeScript will autocomplete and type-check
}

// Type-safe API calls
const createInvoice = async (
  customerId: string,
  amount: number
): Promise<Invoice> => {
  const { invoice } = await client.invoices.create({
    customerId,
    lineItems: [
      {
        description: 'Service',
        quantity: 1,
        unitAmount: amount,
      },
    ],
  });
  return invoice;
};
```

## Available Resources

The SDK provides access to all Copperx API resources:

- `auth` - Authentication endpoints
- `storage` - File storage
- `organization` - Organization management
- `users` - User management
- `withdrawalAddresses` - Withdrawal address management
- `paymentSetting` - Payment settings
- `invoiceSetting` - Invoice settings
- `userInvites` - User invitations
- `checkoutSessions` - Checkout session management
- `paymentLinks` - Payment link management
- `prices` - Price management
- `products` - Product management
- `subscriptions` - Subscription management
- `invoices` - Invoice management
- `customers` - Customer management
- `transactions` - Transaction listing
- `assets` - Asset information
- `chains` - Chain information
- `paymentIntents` - Payment intent operations
- `coupons` - Coupon management
- `taxRates` - Tax rate management
- `constants` - API constants
- `webhooks` - Webhook endpoint management
- `partner` - Partner account management

## API Reference

For detailed API documentation, visit the [Copperx API Reference](https://copperx.readme.io/).

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
