import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProcessDetails from './pages/ProcessDetails.jsx';
import NotFound from './pages/NotFound.jsx';
import RouteFocus from './components/RouteFocus.jsx';
import ProcessUpdate from './pages/ProcessUpdate.jsx';
import { loadProcesses, persistProcesses } from './services/storage.js';

export default function App() {
  const [store, setStore] = useState(loadProcesses);
  const { processes, warning } = store;
  const [notice, setNotice] = useState(null);
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname === '/' || pathname.endsWith('/edit')) setNotice(null);
  }, [pathname]);

  function saveProcess(id, state) {
    const updated = processes.map((process) => process.id === id ? { ...process, ...state } : process);
    const saved = persistProcesses(updated);
    if (!saved.ok) return saved;
    setStore({ processes: updated, warning: null });
    setNotice({ processId: id });
    return { ok: true };
  }
  return (
    <Layout>
        <RouteFocus />
        {warning && <p className="notice notice--warning" role="alert">{warning}</p>}
        <Routes>
          <Route path="/" element={<Dashboard processes={processes} />} />
          <Route path="/processes/:id" element={<ProcessDetails processes={processes} notice={notice} />} />
          <Route path="/processes/:id/edit" element={<ProcessUpdate processes={processes} onSave={saveProcess} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
    </Layout>
  );
}
