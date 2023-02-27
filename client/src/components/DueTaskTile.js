import React from "react";

import { faSquareCheck, faRectangleXmark, faFaceFrown } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const DueTaskTile = ({ id, name, description, image, startDate, endDate, interval, completedForToday, completeTask, uncompleteTask }) => {
  const startDateString = (new Date(startDate)).toLocaleDateString("en-US");

  const handleCompleteClick = async (event) => {
    await completeTask(id);
  }

  const handleUncompleteClick = async (event) => {
    await uncompleteTask(id);
  }

  const doNothing = () => { }

  let buttons;
  if (completedForToday) {
    buttons = (
      <button className="button" onClick={handleUncompleteClick}>
        <FontAwesomeIcon icon={faRectangleXmark} />
        &nbsp;Unmark done
      </button>
    )
  } else {
    buttons = (
        <button className="button" onClick={handleCompleteClick}>
          <FontAwesomeIcon icon={faSquareCheck} />
          &nbsp;Mark done
        </button>
    );
  }

  return (
    <div className={`task-tile callout cell small-12 medium-6 large-4 shadow-sharp`}>
      <div className="task-tile-info">
        <div className="task-tile-top">
          <p className="header task-tile-header">{name}</p>
        </div>
        <p>{description}</p>
        <img src={image} />
      </div>
      <div className="task-tile-buttons">
        {buttons}
      </div>
    </div>
  )
}

export default DueTaskTile;