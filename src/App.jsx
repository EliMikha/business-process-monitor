import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { initialProcesses } from './data/processes.js';
import ProcessDetails from './pages/ProcessDetails.jsx';
import NotFound from './pages/NotFound.jsx';
import RouteFocus from './components/RouteFocus.jsx';
import ProcessUpdate from './pages/ProcessUpdate.jsx';

export default function App() {
  const [processes, setProcesses] = useState(initialProcesses);
  const [notice, setNotice] = useState(null);
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname === '/' || pathname.endsWith('/edit')) setNotice(null);
  }, [pathname]);

  function saveProcess(id, state) {
    setProcesses((previous) => previous.map((process) => process.id === id ? { ...process, ...state } : process));
    setNotice({ processId: id });
    return { ok: true };
  }
  return (
    <Layout>
        <RouteFocus />
        <Routes>
          <Route path="/" element={<Dashboard processes={processes} />} />
          <Route path="/processes/:id" element={<ProcessDetails processes={processes} notice={notice} />} />
          <Route path="/processes/:id/edit" element={<ProcessUpdate processes={processes} onSave={saveProcess} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
    </Layout>
  );
}
