import React, { useState, useEffect, useRef } from "react";

import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import TaskForm from "./TaskForm.js";
import TaskTile from "./TaskTile.js";

const AllTasksList = ({ currentUser, ...props }) => {
  const [tasks, setTasks] = useState([]);
  const [formMode, setFormMode] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [editTaskData, setEditeditTaskData] = useState(null);
  const formDivRef = useRef(null);

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

  const editTaskTile = (editedTask) => {
    const originalTaskTile = tasks.find(task => task.id === editedTask.id);
    for (const field in editedTask) {
      originalTaskTile[field] = editedTask[field];
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
      const newTasksList = tasks.filter(task => task.id !== id);
      setTasks(newTasksList);
      if (!response.ok) {
        throw new Error(`${response.status} (${response.statusText})`);
      }
    } catch (error) {
      console.error(`Error in fetch: ${error.message}`);
    }
  }

  const setFormToAdd = () => {
    setFormMode("add");
    setDisabled("all");
  }

  const setFormToEdit = (taskTileId) => {
    setFormMode("edit");
    setDisabled(taskTileId);
    setEditeditTaskData(tasks.find(task => task.id === taskTileId));
  }

  const closeForm = (event) => {
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
      setFormToEdit={setFormToEdit}
      disabled={disabled}
    />;
  })

  let formComponent = (
    <button className="button" onClick={setFormToAdd}>
      <FontAwesomeIcon icon={faSquarePlus} />
      &nbsp;Add task
    </button>
  );
  if (formMode) {
    formComponent = (
      <div className="grid-x grid-margin-x">
        <div id="task-form-div" className="task-tile callout cell small-12 medium-6 large-4 shadow-sharp" ref={formDivRef}>
          <TaskForm
            formMode={formMode}
            closeForm={closeForm}
            currentUser={currentUser}
            addTaskTile={addTaskTile}
            editTaskTile={editTaskTile}
            scrollToForm={scrollToForm}
            editTaskData={editTaskData}
          />
        </div>
      </div>
    );
  }

  const componentDidUpdate = () => {
    console.log("updated")
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
  );
}

export default AllTasksList;