import React from "react";

import { faSquareCheck, faRectangleXmark, faFaceFrown } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const DueTaskTile = ({ id, name, description, startDate, endDate, interval, completeTask }) => {
  const startDateString = (new Date(startDate)).toLocaleDateString("en-US");

  const handleClick = async (event) => {
    await completeTask(id);
  }

  return (
    <div className={`task-tile callout cell small-12 medium-6 large-4 shadow-sharp`}>
      <div className="task-tile-info">
        <div className="task-tile-top">
          <p className="header task-tile-header">{name}</p>
        </div>
        <p>{description}</p>
      </div>
      <div className="task-tile-buttons">
        <button className="button" onClick={console.log("nothing")}>
          <FontAwesomeIcon icon={faSquareCheck} />
          &nbsp;Accept
        </button>
        <button className="button" onClick={console.log("nothing")}>
          <FontAwesomeIcon icon={faFaceFrown} />
          &nbsp;Overdue
        </button>
        <button className="button" onClick={console.log("nothing")}>
          <FontAwesomeIcon icon={faRectangleXmark} />
          &nbsp;Decline
        </button>
      </div>
    </div>
  )
}

export default DueTaskTile;