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
    setForDate(addDaysToDate(forDate, 1));
  }

  const prevDay = () => {
    setForDate(addDaysToDate(forDate, -1));
  }

  const today = () => {
    setForDate(new Date());
  }

  const markTask = async (id, markAs) => {
    try {
      const response = await fetch(`/api/v1/tasks/${markAs}`, {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json"
        }),
        body: JSON.stringify({ id: id, forDate: forDate.toLocaleDateString("en-us") })
      });
      if (!response.ok) {
        throw new Error(`${response.status} (${response.statusText})`);
      }
      const newTasks = tasks.filter(task => task.id !== id);
      const newlyMarkedTask = {
        ...tasks.find(task => task.id === id),
        completedForToday: markAs === "complete" ? true : false
      };
      setTasks([...newTasks, newlyMarkedTask]);
    } catch (error) {
      console.error(`Error in fetch: ${error.message}`);
    }
  }

  let completedTasksArray = [], uncompletedTasksArray = [];
  tasks.forEach(task => {
    let arrayToPushTo;
    switch (task.completedForToday) {
      case true: arrayToPushTo = completedTasksArray; break;
      case false: arrayToPushTo = uncompletedTasksArray;
    };
    arrayToPushTo.push(
      <DueTaskTile
        key={task.id}
        id={task.id}
        {...task}
        markTask={markTask}
      />);
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