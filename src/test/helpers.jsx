import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import App from '../App.jsx';
import { initialProcesses } from '../data/processes.js';
import { STORAGE_KEY } from '../services/storage.js';

export function renderApp(route = '/processes/order/edit') {
  return render(<MemoryRouter initialEntries={[route]}><App /></MemoryRouter>);
}

// Arrange a saved session without calling the saving function under test.
export function seedSavedProcesses(overrides = {}) {
  const processes = initialProcesses.map((process) => ({
    id: process.id,
    status: process.status,
    progress: process.progress,
    current_stage_id: process.current_stage_id,
    ...overrides[process.id],
  }));
  const raw = JSON.stringify({ version: 1, processes });
  window.localStorage.setItem(STORAGE_KEY, raw);
  return raw;
}
