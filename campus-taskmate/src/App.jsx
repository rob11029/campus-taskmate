import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Sidebar from './components/layout/Sidebar';
import TaskForm from './components/TaskForm';
import Modal from './components/Modal';
import Login from './Login';
import CalendarGrid from './components/CalendarGrid';
import KanbanView from './components/KanbanView';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState('Dashboard');
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // ✅ Reusable task-fetching function
  const fetchTasks = async () => {
    try {
      const res = await fetch(`https://68143536225ff1af162829e7.mockapi.io/campus-taskmate/tasks?userId=${currentUser.id}`);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchTasks();
    }
  }, [currentUser]);

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setTasks([]);
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
            isLoggedIn ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login onLogin={(user) => {
                setCurrentUser(user);
                setIsLoggedIn(true);
              }} />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <div className="layout">
                <Sidebar setSection={setSection} handleSignOut={handleSignOut} />
                <main className="main-content">
                  {section === 'Dashboard' && (
                    <>
                      <div className="dashboard-header">
                        <h1>Campus TaskMate 📘</h1>
                        <p>Welcome, {currentUser?.username}!</p>
                      </div>
                      <KanbanView currentUser={currentUser} tasks={tasks} />
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
                        <TaskForm currentUser={currentUser} fetchTasks={fetchTasks} />
                      </Modal>
                    </div>
                  )}

                  {section === 'Calendar' && (
                    <>
                      <h1>📅 Calendar View</h1>
                      <CalendarGrid tasks={tasks} />
                    </>
                  )}

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
