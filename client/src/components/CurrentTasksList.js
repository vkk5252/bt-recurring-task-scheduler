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
    setForDate(new Date(next));
  }

  const prevDay = () => {
    const prev = addDaysToDate(forDate, -1);
    setForDate(new Date(prev));
  }

  const today = () => {
    setForDate(new Date());
  }

  const completeTask = async (id) => {
    try {
      const response = await fetch(`/api/v1/tasks/complete`, {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json"
        }),
        body: JSON.stringify({ id: id, forDate: forDate.toLocaleDateString("en-us") })
      });
      const body = await response.json();
      if (!response.ok) {
        throw new Error(`${response.status} (${response.statusText})`);
      }
      setForDate(new Date(forDate));
    } catch (error) {
      console.error(`Error in fetch: ${error.message}`);
    }
  }

  const uncompleteTask = async (id) => {
    try {
      const response = await fetch(`/api/v1/tasks/uncomplete`, {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json"
        }),
        body: JSON.stringify({ id: id, forDate: forDate.toLocaleDateString("en-us") })
      });
      if (!response.ok) {
        throw new Error(`${response.status} (${response.statusText})`);
      }
      setForDate(new Date(forDate));
    } catch (error) {
      console.error(`Error in fetch: ${error.message}`);
    }
  }

  const uncompletedTasksArray = tasks.filter(task => !task.completedForToday).map(task => {
    return <DueTaskTile
      key={task.id}
      id={task.id}
      {...task}
      completeTask={completeTask}
      uncompleteTask={uncompleteTask}
    />;
  });

  const completedTasksArray = tasks.filter(task => task.completedForToday).map(task => {
    return <DueTaskTile
      key={task.id}
      id={task.id}
      {...task}
      completeTask={completeTask}
      uncompleteTask={uncompleteTask}
    />;
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
        <button className="button today-button" onClick={today}>{dateString}</button>
        <button className="button" onClick={nextDay}>
          Next day
          &nbsp;<FontAwesomeIcon icon={faSquareCaretRight} />
        </button>
      </div>
      <div className="grid-x grid-margin-x">
        {uncompletedTasksArray}
      </div>
      <hr />
      <div className="grid-x grid-margin-x">
        {completedTasksArray}
      </div>
    </div>
  );
}

export default CurrentTasksList;