import { useState } from 'react';
import './TaskForm.css';

export default function TaskForm({ currentUser, fetchTasks }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      setError("User not logged in.");
      return;
    }

    const newTask = {
      title,
      description,
      priority,
      dueDate,
      userId: currentUser.id,
      status: 'todo' // ⬅️ Added to support Kanban columns
    };

    try {
      const response = await fetch('https://68143536225ff1af162829e7.mockapi.io/campus-taskmate/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTask)
      });

      if (!response.ok) throw new Error('Failed to create task.');

      await fetchTasks(); // ⬅️ Refetch updated tasks list
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setDueDate('');
      setError(null);
    } catch (err) {
      console.error("Error creating task:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <form className="task-form-dark" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        placeholder="Add description..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="form-row">
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <button type="submit">Create Task</button>
      {error && <p className="error-message">{error}</p>}
    </form>
  );
}
