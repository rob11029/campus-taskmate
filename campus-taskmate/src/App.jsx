import { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/layout/Sidebar';
import TaskForm from './components/TaskForm';
import Modal from './components/Modal';

function App() {
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState('Dashboard');
  const [showModal, setShowModal] = useState(false); // modal toggle

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <h1 className="loading-title">Campus TaskMate</h1>
      </div>
    );
  }

  return (
    <div className="layout">
      <Sidebar setSection={setSection} />
      <main className="main-content">
        {section === 'Dashboard' && (
          <>
            <h1>Campus TaskMate 📘</h1>
            <p>Welcome! Start adding tasks and managing your schedule.</p>
          </>
        )}

        {section === 'Tasks' && (
          <div className="center-tasks">
            <h1>📝 Tasks</h1>
            <button className="open-task-btn" onClick={() => setShowModal(true)}>
              ➕ New Task
            </button>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
              <TaskForm />
            </Modal>
          </div>
        )}

        {section === 'Calendar' && <h1>📅 Calendar View</h1>}
        {section === 'Progress' && <h1>📊 Progress Stats</h1>}
        {section === 'Settings' && <h1>⚙️ Settings</h1>}
      </main>
    </div>
  );
}

export default App;
