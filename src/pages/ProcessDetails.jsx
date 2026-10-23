import { Link, useParams } from 'react-router';
import StatusBadge from '../components/StatusBadge.jsx';
import ProgressIndicator from '../components/ProgressIndicator.jsx';
import { getEmployeeName } from '../data/processes.js';
import NotFound from './NotFound.jsx';

export default function ProcessDetails({ processes, notice }) {
  const { id } = useParams();
  const process = processes.find((item) => item.id === id);
  if (!process) return <NotFound process />;
  const currentIndex = process.stages.findIndex((stage) => stage.id === process.current_stage_id);
  return (
    <>
      <Link className="back-link" to="/">‹ К списку процессов</Link>
      <h1 className="page-title" tabIndex={-1}>{process.name}</h1>
      <p className="page-description">{process.description}</p>
      {notice?.processId === id && <p className="notice notice--success" role="status">Изменения сохранены.</p>}
      <div className="details-grid">
        <section className="panel" aria-labelledby="stages-title">
          <h2 id="stages-title" className="section-title">Этапы процесса</h2>
          <p className="panel-description">Текущий этап выделен. Последовательность этапов фиксирована.</p>
          <ol className="stage-list" role="list">
            {process.stages.map((stage, index) => (
              <li className={`stage-item ${index === currentIndex ? 'stage-item--current' : ''} ${index < currentIndex ? 'stage-item--past' : ''}`}
                  key={stage.id} aria-current={index === currentIndex ? 'step' : undefined}>
                <span className="stage-number" aria-hidden="true">{index + 1}</span>
                <div>
                  <p className="stage-title">{stage.name}</p>
                  {index === currentIndex && <span className="stage-caption">Текущий этап</span>}
                </div>
              </li>
            ))}
          </ol>
        </section>
        <section className="panel state-panel" aria-labelledby="state-title">
          <h2 id="state-title" className="section-title">Состояние процесса</h2>
          <dl className="state-details">
            <div><dt className="visually-hidden">Статус</dt><dd><StatusBadge status={process.status} /></dd></div>
            <div><dt className="visually-hidden">Прогресс выполнения</dt><dd><ProgressIndicator value={process.progress} processName={process.name} /></dd></div>
            <div className="state-responsible">
              <dt className="field-label">Ответственный</dt>
              <dd className="state-responsible-name">{getEmployeeName(process.responsible_id)}</dd>
            </div>
          </dl>
          <Link className="button button--primary" to={`/processes/${id}/edit`}>Изменить состояние</Link>
        </section>
      </div>
    </>
  );
}
