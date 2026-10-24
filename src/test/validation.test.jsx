import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { STORAGE_KEY } from '../services/storage.js';
import { renderApp, seedSavedProcesses } from './helpers.jsx';

describe('R1 / FE-016: валидация перед сохранением', () => {
  it.each([
    ['V01', '', 'пустой ввод'],
    ['V02', '-1', 'отрицательное число'],
    ['V03', '101', 'выход за верхнюю границу'],
    ['V04', '12.5', 'дробное число'],
    ['V05', 'abc', 'нечисловой ввод'],
  ])('%s: %s (%s) вызывает ошибку без записи и потери черновика', async (_id, value) => {
    const user = userEvent.setup();
    const previous = seedSavedProcesses();
    const write = vi.spyOn(Storage.prototype, 'setItem');
    renderApp();
    const progress = screen.getByRole('textbox', { name: 'Прогресс, %' });
    await user.clear(progress);
    if (value) await user.type(progress, value);
    await user.click(screen.getByRole('button', { name: 'Сохранить' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Изменения не сохранены');
    expect(progress).toHaveAttribute('aria-invalid', 'true');
    expect(progress).toHaveValue(value);
    expect(write).not.toHaveBeenCalled();
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe(previous);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('V06: «Завершён» с 20% отклоняется даже на последнем этапе', async () => {
    const user = userEvent.setup();
    const previous = seedSavedProcesses();
    renderApp();
    await user.click(screen.getByRole('button', { name: 'Следующий этап' }));
    await user.selectOptions(screen.getByRole('combobox', { name: 'Статус' }), 'completed');
    const progress = screen.getByRole('textbox', { name: 'Прогресс, %' });
    await user.clear(progress);
    await user.type(progress, '20');
    await user.click(screen.getByRole('button', { name: 'Сохранить' }));

    expect(screen.getByText('Для статуса «Завершён» укажите 100%.')).toBeInTheDocument();
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe(previous);
  });

  it('V07: «Завершён» со 100% отклоняется до последнего этапа', async () => {
    const user = userEvent.setup();
    const previous = seedSavedProcesses();
    renderApp();
    await user.selectOptions(screen.getByRole('combobox', { name: 'Статус' }), 'completed');
    const progress = screen.getByRole('textbox', { name: 'Прогресс, %' });
    await user.clear(progress);
    await user.type(progress, '100');
    await user.click(screen.getByRole('button', { name: 'Сохранить' }));

    expect(screen.getByText('Завершить процесс можно только на последнем этапе. Для продвижения выберите «Выполняется».')).toBeInTheDocument();
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe(previous);
  });

  it('V08: «Не начат» с 0% отклоняется на третьем этапе', async () => {
    const user = userEvent.setup();
    const previous = seedSavedProcesses();
    renderApp();
    await user.selectOptions(screen.getByRole('combobox', { name: 'Статус' }), 'not_started');
    const progress = screen.getByRole('textbox', { name: 'Прогресс, %' });
    await user.clear(progress);
    await user.type(progress, '0');
    await user.click(screen.getByRole('button', { name: 'Сохранить' }));

    expect(screen.getByText('Статус «Не начат» допустим только на первом этапе. Выберите другой статус или отмените изменения.')).toBeInTheDocument();
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe(previous);
  });

  it.each([
    ['V09', 'hire', 'not_started', '0', 'Не начат', false],
    ['V10', 'order', 'in_progress', '1', 'Выполняется', false],
    ['V11', 'order', 'in_progress', '99', 'Выполняется', false],
    ['V12', 'order', 'blocked', '0', 'Заблокирован', false],
    ['V13', 'order', 'blocked', '99', 'Заблокирован', false],
    ['V14', 'order', 'completed', '100', 'Завершён', true],
  ])('%s: допустимая граница %s / %s / %s сохраняется', async (_id, id, status, value, label, advance) => {
    const user = userEvent.setup();
    renderApp(`/processes/${id}/edit`);
    if (advance) await user.click(screen.getByRole('button', { name: 'Следующий этап' }));
    await user.selectOptions(screen.getByRole('combobox', { name: 'Статус' }), status);
    const progress = screen.getByRole('textbox', { name: 'Прогресс, %' });
    await user.clear(progress);
    await user.type(progress, value);
    await user.click(screen.getByRole('button', { name: 'Сохранить' }));

    expect(screen.getByRole('status')).toHaveTextContent('Изменения сохранены');
    expect(screen.getByText(label, { exact: true })).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('value', value);
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    expect(saved.processes.find((process) => process.id === id)).toMatchObject({ status, progress: Number(value) });
  });
});
