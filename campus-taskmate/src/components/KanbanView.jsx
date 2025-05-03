import React, { useEffect, useState } from 'react';
import './KanbanView.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import EditableTaskModal from './EditableTaskModal';

const initialColumns = {
  todo: { name: 'To Do', items: [] },
  inprogress: { name: 'In Progress', items: [] },
  done: { name: 'Done', items: [] }
};

export default function KanbanView({ currentUser }) {
  const [columns, setColumns] = useState(initialColumns);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTasks = async () => {
    if (!currentUser) return;

    try {
      const res = await fetch(`https://68143536225ff1af162829e7.mockapi.io/campus-taskmate/tasks?userId=${currentUser.id}`);
      const tasks = await res.json();

      const newCols = {
        todo: { name: 'To Do', items: [] },
        inprogress: { name: 'In Progress', items: [] },
        done: { name: 'Done', items: [] }
      };

      tasks.forEach(task => {
        const status = task.status || 'todo';
        const safeTask = { ...task };
        if (newCols[status]) {
          newCols[status].items.push(safeTask);
        } else {
          newCols.todo.items.push(safeTask);
        }
      });

      setColumns(newCols);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [currentUser]);

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }

    const sourceCol = columns[source.droppableId];
    const destCol = columns[destination.droppableId];

    const sourceItems = [...sourceCol.items];
    const destItems = [...destCol.items];

    const [moved] = sourceItems.splice(source.index, 1);
    moved.status = destination.droppableId;

    if (source.droppableId === destination.droppableId) {
      sourceItems.splice(destination.index, 0, moved);
    } else {
      destItems.splice(destination.index, 0, moved);
    }

    const updatedCols = {
      ...columns,
      [source.droppableId]: { ...sourceCol, items: sourceItems },
      [destination.droppableId]: { ...destCol, items: destItems }
    };

    setColumns(updatedCols);

    try {
      await fetch(`https://68143536225ff1af162829e7.mockapi.io/campus-taskmate/tasks/${moved.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: moved.status })
      });
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleSave = (updatedTask) => {
    setColumns(prevCols => {
      const newCols = { ...prevCols };
      const oldColId = selectedTask.status;
      const newColId = updatedTask.status;

      newCols[oldColId].items = newCols[oldColId].items.filter(t => t.id !== updatedTask.id);
      newCols[newColId].items.push(updatedTask);

      return newCols;
    });

    fetch(`https://68143536225ff1af162829e7.mockapi.io/campus-taskmate/tasks/${updatedTask.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask)
    }).catch(err => console.error('Failed to update task:', err));

    setIsModalOpen(false);
  };

  const handleDelete = () => {
    const colId = selectedTask.status;

    setColumns(prevCols => {
      const newCols = { ...prevCols };
      newCols[colId].items = newCols[colId].items.filter(t => t.id !== selectedTask.id);
      return newCols;
    });

    fetch(`https://68143536225ff1af162829e7.mockapi.io/campus-taskmate/tasks/${selectedTask.id}`, {
      method: 'DELETE'
    }).catch(err => console.error('Failed to delete task:', err));

    setIsModalOpen(false);
  };

  const formatDueDate = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 1) return `Due in ${diffDays} days`;
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays === 0) return 'Due today';
    if (diffDays === -1) return 'Overdue by 1 day';
    return `Overdue by ${Math.abs(diffDays)} days`;
  };

  const getDueStatus = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diff = due - today;
    const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'overdue';
    if (diffDays === 0) return 'due-today';
    return 'upcoming';
  };

  return (
    <div className="kanban-board">
      <DragDropContext onDragEnd={onDragEnd}>
        {Object.entries(columns).map(([colId, col]) => (
          <Droppable key={colId} droppableId={colId}>
            {(provided) => (
              <div
                className="kanban-column"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <h3>{col.name}</h3>
                {col.items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <div
                        className="kanban-card"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={(e) => {
                          if (e.detail === 1) {
                            setTimeout(() => handleEditTask(item), 150);
                          }
                        }}
                      >
                        <div className="kanban-card-content">
                          <strong>{item.title}</strong>
                          <div className="task-meta">
                            {item.dueDate && (
                              <span className={`due-date ${getDueStatus(item.dueDate)}`}>
                                {formatDueDate(item.dueDate)}
                              </span>
                            )}
                            {item.priority && (
                              <span className={`priority-badge ${item.priority.toLowerCase()}`}>
                                {item.priority}
                              </span>
                            )}
                          </div>
                          {item.description && <p>{item.description}</p>}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>

      {isModalOpen && selectedTask && (
        <EditableTaskModal
          task={selectedTask}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
