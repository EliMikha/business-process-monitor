import { Route, Routes } from 'react-router';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { initialProcesses } from './data/processes.js';

export default function App() {
  return (
    <Layout>
        <Routes>
          <Route path="/" element={<Dashboard processes={initialProcesses} />} />
          <Route path="/processes/:id" element={<h1>Карточка процесса</h1>} />
          <Route path="/processes/:id/edit" element={<h1>Изменить состояние</h1>} />
          <Route path="*" element={<h1>Страница не найдена</h1>} />
        </Routes>
    </Layout>
  );
}
