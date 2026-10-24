import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

// jsdom does not implement visual scrolling. Business rules are not mocked.
Object.defineProperty(Element.prototype, 'scrollIntoView', {
  configurable: true,
  value: vi.fn(),
});

beforeEach(() => {
  window.localStorage.clear();
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
