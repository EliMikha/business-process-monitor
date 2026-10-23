import { Link } from 'react-router';

export default function NotFound({ process = false }) {
  return (
    <section className="panel empty-state">
      <h1 className="page-title" tabIndex={-1}>{process ? 'Процесс не найден' : 'Страница не найдена'}</h1>
      <p className="muted">Проверьте адрес или вернитесь к списку процессов.</p>
      <Link className="back-link" to="/">К списку процессов</Link>
    </section>
  );
}
