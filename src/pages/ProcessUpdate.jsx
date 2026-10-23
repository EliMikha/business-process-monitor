import { useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import Button from '../components/Button.jsx';
import { statusDefinitions } from '../data/statuses.js';
import { createDraft, getNextStageId, validateState } from '../services/validation.js';
import NotFound from './NotFound.jsx';

function ProcessForm({ process, onSave }) {
  const [draft, setDraft] = useState(() => createDraft(process));
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const statusRef = useRef(null);
  const progressRef = useRef(null);
  const stageRef = useRef(null);
  const messageRef = useRef(null);
  const stageIndex = process.stages.findIndex((stage) => stage.id === draft.current_stage_id);
  const nextStageId = getNextStageId(process, draft);

  function changeField(event) {
    const { name, value } = event.target;
    setDraft((previous) => ({ ...previous, [name]: value }));
    setErrors({});
  }

  function advanceStage() {
    if (!nextStageId) return;
    setDraft((previous) => ({ ...previous, current_stage_id: nextStageId }));
    setErrors({});
  }

  function submit(event) {
    event.preventDefault();
    const result = validateState(process, draft);
    if (!result.valid) {
      setErrors(result.errors);
      const target = result.errors.status ? statusRef : result.errors.progress ? progressRef : stageRef;
      target.current?.focus();
      return;
    }
    const saved = onSave(process.id, result.value);
    if (!saved.ok) {
      setErrors({ form: saved.error });
      requestAnimationFrame(() => messageRef.current?.focus());
      return;
    }
    navigate(`/processes/${process.id}`);
  }

  return (
    <div className="edit-page">
      <Link className="back-link" to={`/processes/${process.id}`}>‹ К карточке процесса</Link>
      <h1 className="page-title" tabIndex={-1}>Изменить состояние</h1>
      <p className="page-description">{process.name}</p>
      <form className="panel update-form" noValidate onSubmit={submit}>
        {Object.keys(errors).length > 0 && (
          <div className="notice notice--error" role="alert" ref={messageRef} tabIndex={-1}>
            {errors.form ?? 'Изменения не сохранены. Проверьте отмеченные поля.'}
          </div>
        )}
        <div className="form-field">
          <label className="form-label" htmlFor="status">Статус</label>
          <select id="status" name="status" ref={statusRef} value={draft.status} onChange={changeField}
                  aria-invalid={Boolean(errors.status)} aria-describedby={errors.status ? 'status-error' : undefined}>
            {Object.entries(statusDefinitions).map(([value, definition]) => <option key={value} value={value}>{definition.label}</option>)}
          </select>
          {errors.status && <p id="status-error" className="field-error">{errors.status}</p>}
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="progress">Прогресс, %</label>
          <input id="progress" name="progress" ref={progressRef} type="text" inputMode="numeric" autoComplete="off"
                 value={draft.progress} onChange={changeField} aria-invalid={Boolean(errors.progress)}
                 aria-describedby={`progress-hint${errors.progress ? ' progress-error' : ''}`} />
          <p id="progress-hint" className="field-hint">Целое число от 0 до 100. Прогресс указывается вручную.</p>
          {errors.progress && <p id="progress-error" className="field-error">{errors.progress}</p>}
        </div>
        <section className="current-stage" aria-labelledby="draft-stage-title" aria-describedby={errors.current_stage_id ? 'stage-error' : undefined}
                 ref={stageRef} tabIndex={-1}>
          <h2 id="draft-stage-title" className="form-label">Текущий этап</h2>
          <div aria-live="polite" aria-atomic="true">
            <p className="process-number">Этап {stageIndex + 1} из {process.stages.length}</p>
            <p className="current-stage-name">{process.stages[stageIndex].name}</p>
          </div>
          <Button variant="secondary" disabled={!nextStageId} onClick={advanceStage}>Следующий этап</Button>
          <p className="field-hint">Переход не изменяет процент автоматически. Изменения этапа сохраняются вместе с формой.</p>
          {!nextStageId && <p className="field-hint">{stageIndex === process.stages.length - 1 ? 'Достигнут последний этап.' : 'Переход доступен при статусе «Выполняется».'}</p>}
          {errors.current_stage_id && <p id="stage-error" className="field-error">{errors.current_stage_id}</p>}
        </section>
        <details className="state-rules">
          <summary>Допустимые сочетания состояния</summary>
          <ul>
            <li>Не начат: 0% и первый этап.</li>
            <li>Выполняется: 1–99% и любой этап.</li>
            <li>Завершён: 100% и последний этап.</li>
            <li>Заблокирован: 0–99% и любой этап.</li>
          </ul>
        </details>
        <div className="form-actions">
          <Button type="submit">Сохранить</Button>
          <Link className="button button--secondary" to={`/processes/${process.id}`}>Отмена</Link>
        </div>
      </form>
    </div>
  );
}

export default function ProcessUpdate({ processes, onSave }) {
  const { id } = useParams();
  const process = processes.find((item) => item.id === id);
  if (!process) return <NotFound process />;
  return <ProcessForm key={process.id} process={process} onSave={onSave} />;
}
