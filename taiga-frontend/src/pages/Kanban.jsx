import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  getTasksBySprint,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskService";
import "./Styles/Kanban.css";

const COLUMNS = [
  "NEW",
  "READY",
  "IN_PROGRESS",
  "READY_FOR_TEST",
  "DONE",
];

const Kanban = () => {
  const sprintId = 1;

  const [tasks, setTasks] = useState([]);
  const [collapsed, setCollapsed] = useState({});
  const [menuTaskId, setMenuTaskId] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [title, setTitle] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const data = await getTasksBySprint(sprintId);
    setTasks(data || []);
  };

  // ==========================
  // DRAG & DROP
  // ==========================
  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const taskId = Number(result.draggableId);
    const newStatus = result.destination.droppableId;

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: newStatus } : t
      )
    );

    await updateTask(taskId, { status: newStatus });
  };

  const toggleColumn = (col) => {
    setCollapsed((prev) => ({ ...prev, [col]: !prev[col] }));
  };

  const openEdit = (task) => {
    setEditTaskId(task.id);
    setTitle(task.title);
    setShowModal(true);
    setMenuTaskId(null);
  };

  const handleSave = async () => {
    if (!title.trim()) return;

    if (editTaskId) {
      const updated = await updateTask(editTaskId, { title });
      setTasks((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t))
      );
    } else {
      const created = await createTask(sprintId, title);
      setTasks((prev) => [...prev, created]);
    }

    setShowModal(false);
    setEditTaskId(null);
    setTitle("");
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="kanban-page">

      <div className="kanban-header">
        <h1>Kanban</h1>
        <button className="add-btn" onClick={() => setShowModal(true)}>
          + New User Story
        </button>
      </div>

      <div className="kanban-body">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="kanban-board">

            {COLUMNS.map((col) => (
              <Droppable droppableId={col} key={col}>
                {(provided, snapshot) => (
                  <div
                    className={`kanban-column ${col} ${
                      collapsed[col] ? "collapsed" : ""
                    } ${snapshot.isDraggingOver ? "drag-over" : ""}`}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <div className="column-header">
                      <span className="column-title">
                        {col.replace("_", " ")}
                      </span>

                      <span
                        className="collapse-arrow"
                        onClick={() => toggleColumn(col)}
                      >
                        ⯈
                      </span>
                    </div>

                    <div className="column-content">
                      {tasks
                        .filter((t) => t.status === col)
                        .map((task, index) => (
                          <Draggable
                            draggableId={task.id.toString()}
                            index={index}
                            key={task.id}
                          >
                            {(provided, snapshot) => (
                              <div
                                className={`kanban-card ${
                                  snapshot.isDragging ? "dragging" : ""
                                }`}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <div className="card-top">
                                  <span className="card-id">
                                    #{task.id}
                                  </span>

                                  <span
                                    className="menu"
                                    onClick={() =>
                                      setMenuTaskId(
                                        menuTaskId === task.id
                                          ? null
                                          : task.id
                                      )
                                    }
                                  >
                                    ⋮
                                  </span>
                                </div>

                                <div className="card-title">
                                  {task.title}
                                </div>

                                {menuTaskId === task.id && (
                                  <div className="card-menu">
                                    <div onClick={() => openEdit(task)}>
                                      ✏️ Edit
                                    </div>
                                    <div onClick={() => handleDelete(task.id)}>
                                      🗑 Delete
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}

                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}

          </div>
        </DragDropContext>
      </div>

     {showModal && (
  <div className="modal-backdrop">
    <div className="modal modern-modal">
      <h2 className="modal-title">
        {editTaskId ? "Edit Task" : "New User Story"}
      </h2>

      <div className="input-group">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter user story title..."
        />
      </div>

      <div className="modal-actions">
        <button className="primary-btn" onClick={handleSave}>
          Save
        </button>
        <button
          className="ghost-btn"
          onClick={() => setShowModal(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default Kanban;