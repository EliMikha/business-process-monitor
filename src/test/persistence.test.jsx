import { describe, expect, it, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { STORAGE_KEY } from '../services/storage.js';
import { renderApp, seedSavedProcesses } from './helpers.jsx';

describe('R2 / FE-017: сохранение и восстановление', () => {
  it('P01: статус и процент видны в карточке, списке и после повторного монтирования', async () => {
    const user = userEvent.setup();
    const view = renderApp();
    await user.selectOptions(screen.getByRole('combobox', { name: 'Статус' }), 'blocked');
    const progress = screen.getByRole('textbox', { name: 'Прогресс, %' });
    await user.clear(progress);
    await user.type(progress, '65');
    await user.click(screen.getByRole('button', { name: 'Сохранить' }));

    expect(screen.getByText('Заблокирован', { exact: true })).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('value', '65');
    await user.click(screen.getByRole('link', { name: 'К списку процессов', exact: true }));
    const card = within(screen.getByRole('article', { name: 'Обработка заказа' }));
    expect(card.getByText('Заблокирован', { exact: true })).toBeInTheDocument();
    expect(card.getByRole('progressbar')).toHaveAttribute('value', '65');
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    expect(saved.processes).toEqual([
      { id: 'order', status: 'blocked', progress: 65, current_stage_id: 'order-preparation' },
      { id: 'purchase', status: 'blocked', progress: 40, current_stage_id: 'purchase-budget' },
      { id: 'hire', status: 'not_started', progress: 0, current_stage_id: 'hire-documents' },
    ]);

    // A new App instance must read storage, rather than reuse the previous React state.
    view.unmount();
    const reopened = renderApp('/processes/order');
    expect(screen.getByText('Заблокирован', { exact: true })).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('value', '65');
    reopened.unmount();
    renderApp('/processes/order/edit');
    expect(screen.getByRole('combobox', { name: 'Статус' })).toHaveValue('blocked');
    expect(screen.getByRole('textbox', { name: 'Прогресс, %' })).toHaveValue('65');
  });

  it('P02: отказ localStorage сохраняет черновик и прежние данные без ложного успеха', async () => {
    const user = userEvent.setup();
    const previous = seedSavedProcesses();
    renderApp();
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Storage quota exceeded', 'QuotaExceededError');
    });
    await user.click(screen.getByRole('button', { name: 'Следующий этап' }));
    await user.selectOptions(screen.getByRole('combobox', { name: 'Статус' }), 'blocked');
    const progress = screen.getByRole('textbox', { name: 'Прогресс, %' });
    await user.clear(progress);
    await user.type(progress, '65');
    await user.click(screen.getByRole('button', { name: 'Сохранить' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Не удалось сохранить изменения в браузере');
    expect(progress).toHaveValue('65');
    expect(screen.getByRole('combobox', { name: 'Статус' })).toHaveValue('blocked');
    expect(screen.getByText('Этап 4 из 4', { exact: true })).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe(previous);
    await user.click(screen.getByRole('link', { name: 'Отмена' }));
    expect(screen.getByRole('progressbar')).toHaveAttribute('value', '50');
    expect(screen.getByText('Выполняется', { exact: true })).toBeInTheDocument();
    expect(screen.getByRole('listitem', { current: 'step' })).toHaveTextContent('Подготовка к отправке');
  });

  it('P03: повреждённые данные дают предупреждение и исходные процессы без перезаписи', () => {
    window.localStorage.setItem(STORAGE_KEY, '{broken json');
    const write = vi.spyOn(Storage.prototype, 'setItem');
    renderApp('/');

    expect(screen.getByRole('alert')).toHaveTextContent('Сохранённые данные недоступны или повреждены');
    expect(screen.getAllByRole('article')).toHaveLength(3);
    const card = within(screen.getByRole('article', { name: 'Обработка заказа' }));
    expect(card.getByRole('progressbar')).toHaveAttribute('value', '50');
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('{broken json');
    expect(write).not.toHaveBeenCalled();
  });
});
