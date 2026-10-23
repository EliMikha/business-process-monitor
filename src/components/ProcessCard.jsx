import { Link } from 'react-router';
import StatusBadge from './StatusBadge.jsx';
import ProgressIndicator from './ProgressIndicator.jsx';

export default function ProcessCard({ process, number, responsible }) {
  const stage = process.stages.find((item) => item.id === process.current_stage_id);
  const initials = responsible.split(' ').map((word) => word[0]).join('');
  return (
    <article className="process-card" aria-labelledby={`${process.id}-title`}>
      <p className="process-number">Процесс {String(number).padStart(2, '0')}</p>
      <dl className="process-status-list">
        <dt className="visually-hidden">Статус</dt>
        <dd><StatusBadge status={process.status} /></dd>
      </dl>
      <h3 id={`${process.id}-title`} className="process-title">{process.name}</h3>
      <dl className="process-details">
        <div className="process-field">
          <dt className="field-label">Текущий этап</dt>
          <dd className="stage-name">{stage.name}</dd>
        </div>
        <div className="process-field process-field--progress">
          <dt className="visually-hidden">Прогресс выполнения</dt>
          <dd><ProgressIndicator value={process.progress} processName={process.name} /></dd>
        </div>
        <div className="process-field process-field--responsible">
          <dt className="field-label">Ответственный</dt>
          <dd className="responsible-name"><span className="avatar" aria-hidden="true">{initials}</span>{responsible}</dd>
        </div>
      </dl>
      <Link className="button button--primary" to={`/processes/${process.id}`} aria-label={`Подробнее о процессе «${process.name}»`}>Подробнее</Link>
    </article>
  );
}
