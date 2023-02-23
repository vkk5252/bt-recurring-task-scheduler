import React, { useState, useEffect } from "react";

import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ErrorList from "./layout/ErrorList.js";
import translateServerErrors from "../services/translateServerErrors.js";

import TaskForm from "./TaskForm.js";
import TaskTile from "./TaskTile.js";

const AllTasksList = ({ currentUser, ...props }) => {
  const [errors, setErrors] = useState({});
  const [tasks, setTasks] = useState([]);
  const [formMode, setFormMode] = useState(false);
  const [disabled, setDisabled] = useState(false);

  console.log("");
  console.log(`Form mode: ${formMode}`);
  console.log(`Disabled: ${disabled}`);

  useEffect(() => {
    getTasks()
  }, [])

  const getTasks = async () => {
    try {
      const response = await fetch("/api/v1/tasks/all")
      if (!response.ok) {
        throw new Error(`${response.status} (${response.statusText})`)
      }
      const body = await response.json()
      setTasks(body.tasks)
    } catch (error) {
      console.error(`Error in fetch: ${error.message}`)
    }
  }

  const addTask = async (formData) => {
    const newTask = { ...formData, userId: parseInt(currentUser.id) };
    try {
      const response = await fetch('/api/v1/tasks/new', {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json"
        }),
        body: JSON.stringify({ newTask })
      });
      if (!response.ok) {
        if (response.status === 422) {
          const errorBody = await response.json()
          const newErrors = translateServerErrors(errorBody.errors);
          return setErrors(newErrors);
        }
        throw new Error(`${response.status} ${response.statusText}`);
      } else {
        const { addedTask } = await response.json();
        setTasks([...tasks, addedTask])
        setErrors({});
        return true;
      }
    } catch (error) {
      console.error(`Fetch post error: ${error.name} ${error.message}`);
    }
  }

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`/api/v1/tasks/${id}`, {
        method: "DELETE",
        headers: new Headers({
          "Content-Type": "application/json"
        })
      });
      console.log("hi");
      const newTasksList = tasks.filter(task => task.id !== id);
      console.log(newTasksList);
      setTasks(newTasksList);
      if (!response.ok) {
        throw new Error(`${response.status} (${response.statusText})`);
      }
    } catch (error) {
      console.error(`Error in fetch: ${error.message}`);
    }
  }

  const handleAddTaskClick = (event) => {
    setFormMode("add");
    setDisabled("all");
  }

  const handleCancelClick = (event) => {
    setFormMode(false);
    setDisabled(false);
  }

  const tasksArray = tasks.map(task => {
    return <TaskTile
      key={task.id}
      id={task.id}
      {...task}
      deleteTask={deleteTask}
      disabled={disabled}
    />;
  })

  let formComponent = (
    <button className="button" onClick={handleAddTaskClick}>
      <FontAwesomeIcon icon={faSquarePlus} />
      &nbsp;Add task
    </button>
  );
  if (formMode) {
    formComponent = (
      <div className="grid-x grid-margin-x">
        <div className="task-tile callout cell small-12 medium-6 large-4 shadow-sharp">
          <ErrorList errors={errors} />
          <TaskForm
            addTask={addTask}
            handleCancelClick={handleCancelClick}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="grid-container">
      <div className="text-center">
        <p className="header page-header">All tasks</p>
      </div>
      <div className="grid-x grid-margin-x">
        {tasksArray}
      </div>
      {formComponent}
    </div>
  )
}

export default AllTasksList;