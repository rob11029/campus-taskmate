import './Sidebar.css';

export default function Sidebar({ setSection, handleSignOut }) {
  return (
    <div className="sidebar">
      <nav>
        <ul>
          <li onClick={() => setSection('Dashboard')} title="Dashboard">📚</li>
          <li onClick={() => setSection('Tasks')} title="Tasks">📝</li>
          <li onClick={() => setSection('Calendar')} title="Calendar">📅</li>
        </ul>
        <button className="sign-out-btn" onClick={handleSignOut}>
          Sign Out
          </button>
      </nav>
    </div>
  );
}