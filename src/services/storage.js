import { initialProcesses } from '../data/processes.js';
import { validateState } from './validation.js';

export const STORAGE_KEY = 'business-process-monitor:v1';
const getBrowserStorage = () => window.localStorage;
const originalProcesses = () => initialProcesses.map((process) => ({ ...process }));

export function loadProcesses(storageProvider = getBrowserStorage) {
  try {
    const raw = storageProvider().getItem(STORAGE_KEY);
    if (raw === null) return { processes: originalProcesses(), warning: null };
    const saved = JSON.parse(raw);
    if (!saved || saved.version !== 1 || !Array.isArray(saved.processes) || saved.processes.length !== initialProcesses.length) {
      throw new Error('Unsupported state format');
    }
    const byId = new Map();
    for (const state of saved.processes) {
      if (!state || typeof state.id !== 'string' || byId.has(state.id) || typeof state.progress !== 'number') {
        throw new Error('Invalid saved record');
      }
      const definition = initialProcesses.find((process) => process.id === state.id);
      if (!definition || !validateState(definition, state).valid) throw new Error('Invalid saved state');
      byId.set(state.id, { status: state.status, progress: state.progress, current_stage_id: state.current_stage_id });
    }
    return {
      processes: initialProcesses.map((process) => ({ ...process, ...byId.get(process.id) })),
      warning: null,
    };
  } catch {
    return {
      processes: originalProcesses(),
      warning: 'Сохранённые данные недоступны или повреждены. Показаны исходные демонстрационные процессы. Проверьте возможность сохранения перед продолжением работы.',
    };
  }
}

export function persistProcesses(processes, storageProvider = getBrowserStorage) {
  try {
    if (processes.length !== initialProcesses.length || new Set(processes.map((process) => process.id)).size !== initialProcesses.length) {
      throw new Error('Invalid process set');
    }
    // В хранилище записываются только изменяемые поля, а не описания и структура.
    const states = processes.map((process) => {
      const definition = initialProcesses.find((item) => item.id === process.id);
      if (!definition || !validateState(definition, process).valid) throw new Error('Invalid state');
      return { id: process.id, status: process.status, progress: process.progress, current_stage_id: process.current_stage_id };
    });
    storageProvider().setItem(STORAGE_KEY, JSON.stringify({ version: 1, processes: states }));
    return { ok: true };
  } catch {
    return { ok: false, error: 'Не удалось сохранить изменения в браузере. Черновик оставлен в форме, сохранённые данные не изменены. Проверьте доступ к локальному хранилищу и повторите попытку.' };
  }
}
