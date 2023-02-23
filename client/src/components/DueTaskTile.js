import React from "react";

const DueTaskTile = ({ id, name, description, startDate, endDate, interval, completeTask }) => {
  const startDateString = (new Date(startDate)).toLocaleDateString("en-US");

  const handleClick = async (event) => {
    await completeTask(id);
  }

  return (
    <>
      <p>{name}</p>
      <p>{description}</p>
      <p>{startDateString}</p>
      <p>{endDate}</p>
      <p>{interval}</p>
      <button className="button" onClick={handleClick}>Accept</button>
      <button className="button">Accept as overdue</button>
      <button className="button">Reject</button>
    </>
  )
}

export default DueTaskTile;