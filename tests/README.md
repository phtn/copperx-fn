# Tests

This directory contains tests for the Copperx SDK.

## Running Tests

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test --watch

# Run a specific test file
bun test tests/auth.test.ts

# Run tests with coverage (if configured)
bun test --coverage
```

## Test Structure

- `tests/` - Test files organized by resource
- `tests/utils/` - Test utilities and mocks

## Writing Tests

Tests use Bun's built-in test framework. Example:

```typescript
import { test, expect, describe, beforeEach } from 'bun:test';
import { createAuthResource } from '../src/resources/auth';
import { MockHTTPClient } from './utils/mock-http-client';

describe('Resource Name', () => {
  let mockClient: MockHTTPClient;
  let resource: ReturnType<typeof createResource>;

  beforeEach(() => {
    mockClient = new MockHTTPClient();
    resource = createResource(mockClient);
  });

  test('should do something', async () => {
    // Test implementation
  });
});
```

## Mock HTTP Client

The `MockHTTPClient` class allows you to mock HTTP requests without making real API calls:

```typescript
import { MockHTTPClient } from './utils/mock-http-client';

const mockClient = new MockHTTPClient();

mockClient.setMockGet(async (url: string) => {
  expect(url).toBe('/expected/path');
  return { data: 'mock response' };
});

mockClient.setMockPost(async (url: string, data: unknown) => {
  expect(url).toBe('/expected/path');
  expect(data).toEqual({ expected: 'data' });
  return { success: true };
});
```

## Test Coverage Goals

- ✅ Happy path scenarios
- ✅ Error handling (authentication, validation, network errors)
- ✅ Edge cases (optional fields, empty responses)
- ✅ Integration scenarios (sequential calls, multiple resources)

