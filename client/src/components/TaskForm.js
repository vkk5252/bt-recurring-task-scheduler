import React, { useState } from "react";

import DatePicker from "react-datepicker";
import { faRectangleXmark, faSquareCheck, faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NewTaskForm = ({ addTask, handleCancelClick }) => {
  const [formData, setFormData] = useState({ startDate: (new Date()).toLocaleDateString("en-US") });
  const [startDate, setStartDate] = useState(null);

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.currentTarget.name]: event.currentTarget.value
    });
  }

  const handleDateChange = (date) => {
    setStartDate(date)
    const dateString = date.toLocaleDateString("en-US")
    setFormData({
      ...formData,
      startDate: dateString
    });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (await addTask(formData)) {
      handleCancelClick();
    }
  }

  return (
    <>
      <h3 className="header">Add a task</h3>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" onChange={handleInputChange} />

        <input type="text" name="description" placeholder="Description" onChange={handleInputChange} />

        <div className="start-date-interval-container">
          <div className="start-date-container">
            <DatePicker selected={startDate} placeholderText={"Start date"} onChange={(date) => handleDateChange(date)} />
          </div>
          <div className="interval-container">
            <input type="number" name="interval" placeholder="Interval (days)" onChange={handleInputChange} />
          </div>
        </div>

        <div className="form-buttons-bottom">
          <button type="button" className="button" onClick={handleCancelClick}>
            <FontAwesomeIcon icon={faRectangleXmark} />
            &nbsp;Cancel
          </button>
          <button type="submit" className="button">
            <FontAwesomeIcon icon={faSquareCheck} />
            &nbsp;Submit</button>
        </div>
      </form>
    </>
  )
}

export default NewTaskForm;