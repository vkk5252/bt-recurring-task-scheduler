import React from "react";

import { faSquareCheck, faRectangleXmark } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const DueTaskTile = ({ id, name, description, image, completedForToday, markTask }) => {
  const handleCompleteClick = async (event) => {
    await markTask(id, "complete");
  }

  const handleUncompleteClick = async (event) => {
    await markTask(id, "uncomplete");
  }

  const buttonDifferences = {
    true: {
      text: "Unmark done",
      icon: faRectangleXmark,
      clickHandler: handleUncompleteClick
    },
    false: {
      text: "Mark done",
      icon: faSquareCheck,
      clickHandler: handleCompleteClick
    }
  }[completedForToday];
  const button = (
    <button className="button" onClick={buttonDifferences.clickHandler}>
      <FontAwesomeIcon icon={buttonDifferences.icon} />
      &nbsp;{buttonDifferences.text}
    </button>
  )

  return (
    <div className={`task-tile callout cell small-12 medium-6 large-4 shadow-sharp`}>
      <div className="task-tile-info">
        <div className="task-tile-top">
          <p className="header task-tile-header">{name}</p>
        </div>
        <p>{description}</p>
        <img src={image} />
      </div>
      <div className="mark-button">
        {button}
      </div>
    </div>
  )
}

export default DueTaskTile;