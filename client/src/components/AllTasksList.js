import React, { useState, useEffect, useRef } from "react";

import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import TaskForm from "./TaskForm.js";
import TaskTile from "./TaskTile.js";

const AllTasksList = ({ currentUser, ...props }) => {
  const [tasks, setTasks] = useState([]);
  const [formMode, setFormMode] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const formDivRef = useRef(null);

  console.log("");
  console.log(`Form mode: ${formMode}`);
  console.log(`Disabled: ${disabled}`);

  useEffect(() => {
    getTasks();
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

  const addTaskTile = (addedTask) => {
    setTasks([...tasks, addedTask])
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

  const handleAddClick = (event) => {
    setFormMode("add");
    setDisabled("all");
    scrollToForm();
  }

  const handleCancelClick = (event) => {
    setFormMode(false);
    setDisabled(false);
  }

  const scrollToForm = () => {
    formDivRef.current?.scrollIntoView({ behavior: "smooth" });
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
    <button className="button" onClick={handleAddClick}>
      <FontAwesomeIcon icon={faSquarePlus} />
      &nbsp;Add task
    </button>
  );
  if (formMode) {
    formComponent = (
      <div className="grid-x grid-margin-x">
        <div className="task-tile callout cell small-12 medium-6 large-4 shadow-sharp" ref={formDivRef}>
          <TaskForm
            formMode={formMode}
            handleCancelClick={handleCancelClick}
            currentUser={currentUser}
            addTaskTile={addTaskTile}
            scrollToForm={scrollToForm}
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
      <div></div>
    </div>
  );
}

export default AllTasksList;