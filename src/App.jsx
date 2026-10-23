import { Link, Route, Routes } from 'react-router';

export default function App() {
  return (
    <>
      <header className="site-header">
        <div className="container header-content">
          <p className="brand"><span className="brand-mark" aria-hidden="true">BP</span><strong>Business Process Monitor</strong></p>
          <Link to="/">К списку процессов</Link>
        </div>
      </header>
      <main className="container main-content">
        <Routes>
          <Route path="/" element={<h1>Бизнес-процессы</h1>} />
          <Route path="/processes/:id" element={<h1>Карточка процесса</h1>} />
          <Route path="/processes/:id/edit" element={<h1>Изменить состояние</h1>} />
          <Route path="*" element={<h1>Страница не найдена</h1>} />
        </Routes>
      </main>
    </>
  );
}
