import React, { useState, useEffect } from "react";
import axios from "axios";

function Create() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const handleAdd = async () => {
    if (task.trim() === "") return; // Prevent adding empty tasks

    try {
      const response = await axios.post(`${import.meta.env.HOST}/add`, {
        task,
      });
      setTodos([response.data, ...todos]); // Add the new task to the top of the list
      setTask(""); // Clear the input field
    } catch (err) {
      console.log("Error adding task:", err);
    }
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.HOST}/get`)
      .then((result) => {
        setTodos(result.data);
      })
      .catch((err) => console.log("Error fetching data:", err));
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.HOST}/delete/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (err) {
      console.log("Error deleting task:", err);
    }
  };

  const handleToggle = async (id, completed) => {
    try {
      await axios.put(`${import.meta.env.HOST}/toggle/${id}`, { completed });
      setTodos(
        todos.map((todo) =>
          todo._id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    } catch (err) {
      console.log("Error toggling task:", err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  return (
    <div className="home">
      <h2>TODO LIST</h2>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter your task"
          onChange={(e) => setTask(e.target.value)}
          value={task}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleAdd}>Add</button>
      </div>
      {todos.length == 0 ? (
        <h3>No Tasks added</h3>
      ) : (
        <div className="tasks">
          {todos.map((todo) => (
            <div key={todo._id} className="task-item">
              <input
                className="Completed"
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggle(todo._id, todo.completed)}
              />
              <span
                className={`task-text ${todo.completed ? "completed" : ""}`}
              >
                {todo.task}
              </span>
              <button onClick={() => handleDelete(todo._id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Create;
