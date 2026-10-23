import { Route, Routes } from 'react-router';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { initialProcesses } from './data/processes.js';
import ProcessDetails from './pages/ProcessDetails.jsx';
import NotFound from './pages/NotFound.jsx';
import RouteFocus from './components/RouteFocus.jsx';

export default function App() {
  return (
    <Layout>
        <RouteFocus />
        <Routes>
          <Route path="/" element={<Dashboard processes={initialProcesses} />} />
          <Route path="/processes/:id" element={<ProcessDetails processes={initialProcesses} />} />
          <Route path="/processes/:id/edit" element={<h1>Изменить состояние</h1>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
    </Layout>
  );
}
