export const STATUS = Object.freeze({
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  BLOCKED: 'blocked',
});

export const statusDefinitions = {
  [STATUS.NOT_STARTED]: { label: 'Не начат', className: 'not-started', asset: 'status-not-started.svg' },
  [STATUS.IN_PROGRESS]: { label: 'Выполняется', className: 'in-progress', asset: 'status-in-progress.svg' },
  [STATUS.COMPLETED]: { label: 'Завершён', className: 'completed', asset: 'status-completed.svg' },
  [STATUS.BLOCKED]: { label: 'Заблокирован', className: 'blocked', asset: 'status-blocked.svg' },
};
