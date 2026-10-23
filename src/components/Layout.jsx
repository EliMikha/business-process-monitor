import { Link } from 'react-router';

export default function Layout({ children }) {
  return (
    <>
      <a className="skip-link" href="#main-content">Перейти к основному содержимому</a>
      <header className="site-header">
        <div className="container header-content">
          <p className="brand">
            <span className="brand-mark" aria-hidden="true">BP</span>
            <strong className="brand-name">Business Process Monitor</strong>
          </p>
          <nav className="site-nav" aria-label="Основная навигация">
            <Link className="nav-link" to="/">К списку процессов</Link>
          </nav>
        </div>
      </header>
      <main id="main-content" className="container main-content" tabIndex={-1}>{children}</main>
      <footer className="container site-footer">
        <p>Business Process Monitor. Учебный проект. Демонстрационные данные.</p>
      </footer>
    </>
  );
}
