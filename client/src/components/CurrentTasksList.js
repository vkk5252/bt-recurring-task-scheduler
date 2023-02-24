import React, { useState, useEffect } from "react";

import { faSquareCaretLeft, faSquareCaretRight } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import addDaysToDate from "../services/addDaysToDate.js";

import DueTaskTile from "./DueTaskTile.js";

const CurrentTasksList = ({ currentUser, ...props }) => {
  const [tasks, setTasks] = useState([]);
  const [forDate, setForDate] = useState(new Date());
  const dateString = forDate.toLocaleDateString("en-us");

  useEffect(() => {
    getTasks();
  }, [forDate]);

  const getTasks = async () => {
    console.log(`Getting tasks for ${dateString}`);
    try {
      const response = await fetch(`/api/v1/tasks/${dateString.replaceAll("/", "-")}`)
      if (!response.ok) {
        throw new Error(`${response.status} (${response.statusText})`)
      }
      const body = await response.json()
      setTasks(body.tasks)
    } catch (error) {
      console.error(`Error in fetch: ${error.message}`)
    }
  }

  const nextDay = () => {
    const next = addDaysToDate(forDate, 1);
    // console.log(next);
    setForDate(new Date(next));
  }

  const prevDay = () => {
    const prev = addDaysToDate(forDate, -1);
    // console.log(prev);
    setForDate(new Date(prev));
  }
  // console.log(forDate);

  const today = () => {
    setForDate(new Date());
    // getTasks();
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
      // console.log(body.addedTaskCompletion);
      if (!response.ok) {
        throw new Error(`${response.status} (${response.statusText})`);
      }
    } catch (error) {
      console.error(`Error in fetch: ${error.message}`);
    }
  }

  const tasksArray = tasks.map(task => {
    return <DueTaskTile key={task.id} id={task.id} {...task} completeTask={completeTask} />;
  });

  return (
    <div className="grid-container">
      <div className="text-center">
        <p className="header page-header">Today's tasks</p>
      </div>
      <div className="prev-next-day-buttons-container">
        <button className="button" onClick={prevDay}>
          <FontAwesomeIcon icon={faSquareCaretLeft} />
          &nbsp;Prev day
        </button>
        <button className="button" onClick={today}>{dateString}</button>
        <button className="button" onClick={nextDay}>
          Next day
          &nbsp;<FontAwesomeIcon icon={faSquareCaretRight} />
        </button>
      </div>
      <div className="grid-x grid-margin-x">
        {tasksArray}
      </div>
    </div>
  );
}

export default CurrentTasksList;