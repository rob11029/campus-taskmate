import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Sidebar from './components/layout/Sidebar';
import TaskForm from './components/TaskForm';
import Modal from './components/Modal';
import Login from './Login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState('Dashboard');
  const [showModal, setShowModal] = useState(false); // Modal toggle

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSignOut = () => {
    setIsLoggedIn(false);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <h1 className="loading-title">Campus TaskMate</h1>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLogin={() => setIsLoggedIn(true)} />
          }
        />

        {/* Main app route */}
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <div className="layout">
                <Sidebar setSection={setSection} handleSignOut={handleSignOut} />
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
                      <button
                        className="open-task-btn"
                        onClick={() => setShowModal(true)}
                      >
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
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;