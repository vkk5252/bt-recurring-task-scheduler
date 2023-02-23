import React from "react";

import { faTrashCan, faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const addDaysToDate = (date, days) => {
  date.setDate(date.getDate() + days);
  return date;
}

const TaskTile = ({ id, name, description, startDate, endDate, interval, deleteTask, setFormToEdit, disabled }) => {

  const thisDisabled = disabled? (disabled === "all") || (disabled !== id) : false;
  const thisButtonsDisabled = !!disabled;
  let disabledClass = "";
  if (thisDisabled) {
    disabledClass = "disabled-task";
  }

  // console.log(`This task is disabled: ${thisDisabled}`);
  // console.log(`disabled is a ${typeof disabled}`);
  // console.log(`thisDisabled is a ${typeof thisDisabled}`);

  const handleDeleteClick = async (event) => {
    await deleteTask(id);
  }

  const handleEditClick = async (event) => {
    setFormToEdit(id);
  }

  // const startDateString = (new Date(startDate)).toLocaleDateString("en-US");
  const intervalString = interval > 1 ? `${interval} days` : "day";
  const nextRecurrenceString = (addDaysToDate(new Date(startDate), interval)).toLocaleDateString("en-us");

  return (
    <div className={`task-tile callout cell small-12 medium-6 large-4 shadow-sharp ${disabledClass}`}>
      <div className="task-tile-info">
        <div className="task-tile-top">
          <p className="header task-tile-header">{name}</p>
          <p>Repeats every {intervalString}</p>
        </div>
        <p>{description}</p>
        <p>Next: {nextRecurrenceString}</p>
      </div>
      <div className="task-tile-buttons">
        <button className="button" onClick={handleDeleteClick} disabled={thisButtonsDisabled}>
          <FontAwesomeIcon icon={faTrashCan} />
          &nbsp;Delete
        </button>
        <button className="button" onClick={handleEditClick} disabled={thisButtonsDisabled}>
          <FontAwesomeIcon icon={faPenToSquare} />
          &nbsp;Edit
        </button>
      </div>
    </div>
  )
}

export default TaskTile;