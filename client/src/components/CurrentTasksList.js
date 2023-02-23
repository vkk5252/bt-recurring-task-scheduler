import React, { useState, useEffect } from "react";

import DueTaskTile from "./DueTaskTile.js";

const CurrentTasksList = ({ currentUser, ...props }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    getTasks()
  }, [])

  const getTasks = async () => {
    try {
      const response = await fetch("/api/v1/tasks/today")
      if (!response.ok) {
        throw new Error(`${response.status} (${response.statusText})`)
      }
      const body = await response.json()
      setTasks(body.tasks)
    } catch (error) {
      console.error(`Error in fetch: ${error.message}`)
    }
  }

  const completeTask = async (id) => {
    try {
      const response = await fetch(`/api/v1/tasks/complete/${id}`, {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json"
        })
      });
      const body = await response.json();
      console.log(body.addedTaskCompletion);
      if (!response.ok) {
        throw new Error(`${response.status} (${response.statusText})`);
      }
    } catch (error) {
      console.error(`Error in fetch: ${error.message}`);
    }
  }

  const tasksArray = tasks.map(task => {
    return <DueTaskTile key={task.id} id={task.id} {...task} completeTask={completeTask} />
  })

  return (
    <div className="grid-container">
      <div className="text-center">
        <p className="header page-header">Today's tasks</p>
      </div>
      <div className="grid-x grid-margin-x">
        {tasksArray}
      </div>
    </div>
  )
}

export default CurrentTasksList;