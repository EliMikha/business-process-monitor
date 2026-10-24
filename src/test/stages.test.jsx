import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { STORAGE_KEY } from '../services/storage.js';
import { renderApp, seedSavedProcesses } from './helpers.jsx';

describe('R3 / FE-015: следующий этап и отмена черновика', () => {
  it('S01: одно нажатие переводит с первого на второй этап без изменения процента', async () => {
    const user = userEvent.setup();
    const previous = seedSavedProcesses();
    const view = renderApp('/processes/hire/edit');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Статус' }), 'in_progress');
    const progress = screen.getByRole('textbox', { name: 'Прогресс, %' });
    await user.clear(progress);
    await user.type(progress, '25');
    await user.click(screen.getByRole('button', { name: 'Следующий этап' }));

    expect(screen.getByText('Этап 2 из 4', { exact: true })).toBeInTheDocument();
    expect(screen.getByText('Оформление договора', { exact: true })).toBeInTheDocument();
    expect(progress).toHaveValue('25');
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe(previous);
    await user.click(screen.getByRole('button', { name: 'Сохранить' }));
    expect(screen.getByRole('listitem', { current: 'step' })).toHaveTextContent('Оформление договора');
    expect(screen.getByRole('progressbar')).toHaveAttribute('value', '25');
    view.unmount();
    renderApp('/processes/hire');
    expect(screen.getByRole('listitem', { current: 'step' })).toHaveTextContent('Оформление договора');
    expect(screen.getByRole('progressbar')).toHaveAttribute('value', '25');
  });

  it('S02: отмена отбрасывает статус, процент и этап, включая повторное открытие', async () => {
    const user = userEvent.setup();
    const previous = seedSavedProcesses();
    const view = renderApp('/processes/hire/edit');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Статус' }), 'in_progress');
    const progress = screen.getByRole('textbox', { name: 'Прогресс, %' });
    await user.clear(progress);
    await user.type(progress, '25');
    await user.click(screen.getByRole('button', { name: 'Следующий этап' }));
    await user.click(screen.getByRole('link', { name: 'Отмена' }));

    expect(screen.getByText('Не начат', { exact: true })).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('value', '0');
    expect(screen.getByRole('listitem', { current: 'step' })).toHaveTextContent('Подготовка документов');
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe(previous);
    view.unmount();
    renderApp('/processes/hire/edit');
    expect(screen.getByRole('combobox', { name: 'Статус' })).toHaveValue('not_started');
    expect(screen.getByRole('textbox', { name: 'Прогресс, %' })).toHaveValue('0');
    expect(screen.getByText('Этап 1 из 4', { exact: true })).toBeInTheDocument();
  });

  it.each([
    ['S03', 'not_started'],
    ['S04', 'blocked'],
    ['S05', 'completed'],
  ])('%s: при выбранном статусе %s переход недоступен', async (_id, status) => {
    const user = userEvent.setup();
    renderApp();
    await user.selectOptions(screen.getByRole('combobox', { name: 'Статус' }), status);

    expect(screen.getByRole('button', { name: 'Следующий этап' })).toBeDisabled();
    expect(screen.getByText('Этап 3 из 4', { exact: true })).toBeInTheDocument();
  });

  it('S06: на последнем этапе переход заблокирован, процент не меняется', async () => {
    const user = userEvent.setup();
    renderApp();
    const next = screen.getByRole('button', { name: 'Следующий этап' });
    await user.click(next);

    expect(screen.getByText('Этап 4 из 4', { exact: true })).toBeInTheDocument();
    expect(screen.getByText('Передача клиенту', { exact: true })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Прогресс, %' })).toHaveValue('50');
    expect(next).toBeDisabled();
    await user.click(next);
    expect(screen.getByText('Этап 4 из 4', { exact: true })).toBeInTheDocument();
  });
});
