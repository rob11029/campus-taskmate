import { useState } from 'react';
import './TaskForm.css';

export default function TaskForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ title, description, priority, dueDate });

    // Clear form
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setDueDate('');
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
    </form>
  );
}
