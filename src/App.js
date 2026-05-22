import { useEffect, useState } from "react";
import "./App.css";

function App() {

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [deadline, setDeadline] = useState("");

  // FETCH TASKS
  const fetchTasks = async () => {

    const response = await fetch("http://127.0.0.1:8000/api/tasks/");
    const data = await response.json();

    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ADD TASK
  const addTask = async () => {

    if(title.trim() === "") return;

    await fetch("http://127.0.0.1:8000/api/tasks/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        details: details,
        deadline: deadline || null,
        is_completed: false,
      }),
    });

    setTitle("");
    setDetails("");
    setDeadline("");
    fetchTasks();
  };

  // COMPLETE TASK
  const completeTask = async (task) => {

    await fetch(`http://127.0.0.1:8000/api/tasks/${task.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: task.title,
        details: task.details,
        deadline: task.deadline,
        is_completed: true,
      }),
    });

    fetchTasks();
  };

  // DELETE TASK
  const deleteTask = async (taskId) => {

    await fetch(`http://127.0.0.1:8000/api/tasks/${taskId}/`, {
      method: "DELETE",
    });

    fetchTasks();
  };

  const pendingTasks = tasks.filter(task => !task.is_completed);
  const completedTasks = tasks.filter(task => task.is_completed);

  const formatDeadline = (deadlineValue) => {
    if(!deadlineValue) return "No deadline";

    return new Date(`${deadlineValue}T00:00:00`).toLocaleDateString();
  };

  return (
    <div className="container">

      <h1>Task Management System</h1>

      <div className="task-form">

        <div className="form-field">
          <label htmlFor="task-title">Task Name</label>
          <input
            id="task-title"
            type="text"
            placeholder="Enter task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="task-deadline">Deadline</label>
          <input
            id="task-deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>

        <div className="form-field details-field">
          <label htmlFor="task-details">Details</label>
          <textarea
            id="task-details"
            placeholder="Add task details..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </div>

        <button onClick={addTask}>
          Add Task
        </button>

      </div>

      <div className="task-summary">

        <div className="summary-card">
          <span>Total Pending Tasks</span>
          <strong>{pendingTasks.length}</strong>
        </div>

        <div className="summary-card completed-count">
          <span>Total Completed Tasks</span>
          <strong>{completedTasks.length}</strong>
        </div>

      </div>

      <div className="task-board">

        <section className="task-column">

          <h2>Pending Tasks</h2>

          <div className="task-list">

            {pendingTasks.map((task) => (

              <div className="task-card" key={task.id}>

                <h3>{task.title}</h3>

                <p>Status: Pending</p>

                {task.details && <p className="task-details">{task.details}</p>}

                <p>Deadline: {formatDeadline(task.deadline)}</p>

                <button
                  className="complete-btn"
                  onClick={() => completeTask(task)}
                >
                  Mark as Completed
                </button>

              </div>

            ))}

          </div>

        </section>

        <section className="task-column">

          <h2>Completed Tasks</h2>

          <div className="task-list">

            {completedTasks.map((task) => (

              <div className="task-card completed" key={task.id}>

                <h3>{task.title}</h3>

                <p>Status: Completed</p>

                {task.details && <p className="task-details">{task.details}</p>}

                <p>Deadline: {formatDeadline(task.deadline)}</p>

                <button
                  className="delete-btn"
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </button>

              </div>

            ))}

          </div>

        </section>

      </div>

    </div>
  );
}

export default App;
