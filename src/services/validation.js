import { STATUS, statusDefinitions } from '../data/statuses.js';

export function createDraft(process) {
  return { status: process.status, progress: String(process.progress), current_stage_id: process.current_stage_id };
}

export function validateState(process, draft) {
  const errors = {};
  if (!draft || typeof draft !== 'object') return { valid: false, errors: { form: 'Состояние процесса не задано.' } };
  if (!Object.hasOwn(statusDefinitions, draft.status)) errors.status = 'Выберите допустимый статус.';
  const stageIndex = process.stages.findIndex((stage) => stage.id === draft.current_stage_id);
  if (stageIndex < 0) errors.current_stage_id = 'Текущий этап должен принадлежать выбранному процессу.';

  let progress;
  if (typeof draft.progress === 'string') {
    if (draft.progress.trim() === '') errors.progress = 'Укажите процент выполнения.';
    else if (!/^\d+$/.test(draft.progress)) errors.progress = 'Введите целое число от 0 до 100 без дробной части и посторонних символов.';
    else progress = Number(draft.progress);
  } else if (typeof draft.progress === 'number') {
    progress = draft.progress;
  } else {
    errors.progress = 'Введите целое число от 0 до 100.';
  }
  if (!errors.progress && (!Number.isInteger(progress) || progress < 0 || progress > 100)) {
    errors.progress = 'Процент должен быть целым числом от 0 до 100.';
  }

  if (!errors.status && !errors.progress) {
    if (draft.status === STATUS.NOT_STARTED && progress !== 0) errors.progress = 'Для статуса «Не начат» укажите 0%.';
    if (draft.status === STATUS.IN_PROGRESS && (progress < 1 || progress > 99)) errors.progress = 'Для статуса «Выполняется» допустимы значения от 1 до 99%.';
    if (draft.status === STATUS.COMPLETED && progress !== 100) errors.progress = 'Для статуса «Завершён» укажите 100%.';
    if (draft.status === STATUS.BLOCKED && progress > 99) errors.progress = 'Для статуса «Заблокирован» допустимы значения от 0 до 99%.';
  }
  if (!errors.current_stage_id) {
    if (draft.status === STATUS.NOT_STARTED && stageIndex !== 0) errors.current_stage_id = 'Статус «Не начат» допустим только на первом этапе. Выберите другой статус или отмените изменения.';
    if (draft.status === STATUS.COMPLETED && stageIndex !== process.stages.length - 1) errors.current_stage_id = 'Завершить процесс можно только на последнем этапе. Для продвижения выберите «Выполняется».';
  }
  const valid = Object.keys(errors).length === 0;
  return {
    valid,
    errors,
    value: valid ? { status: draft.status, progress, current_stage_id: draft.current_stage_id } : undefined,
  };
}

export function getNextStageId(process, draft) {
  const index = process.stages.findIndex((stage) => stage.id === draft.current_stage_id);
  if (draft.status !== STATUS.IN_PROGRESS || index < 0 || index >= process.stages.length - 1) return null;
  return process.stages[index + 1].id;
}
