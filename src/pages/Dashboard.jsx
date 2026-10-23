import ProcessCard from '../components/ProcessCard.jsx';
import { getEmployeeName } from '../data/processes.js';

export default function Dashboard({ processes }) {
  return (
    <>
      <p className="eyebrow">Рабочее пространство</p>
      <h1 className="page-title" tabIndex={-1}>Бизнес-процессы</h1>
      <p className="page-description">Отслеживайте выполнение и поддерживайте сведения в актуальном состоянии.</p>
      <section aria-labelledby="processes-title">
        <h2 id="processes-title" className="visually-hidden">Текущие процессы</h2>
        {processes.length === 0 ? (
          <div className="panel empty-state" role="status">
            <p className="section-title">Процессы отсутствуют</p>
            <p className="muted">Нет данных для отображения.</p>
          </div>
        ) : (
          <ul className="process-list">
            {processes.map((process, index) => (
              <li className="process-item" key={process.id}>
                <ProcessCard process={process} number={index + 1} responsible={getEmployeeName(process.responsible_id)} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
