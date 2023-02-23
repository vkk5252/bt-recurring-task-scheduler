import React, { useState, useEffect } from "react";

import ErrorList from "./layout/ErrorList.js";
import translateServerErrors from "../services/translateServerErrors.js";

import DatePicker from "react-datepicker";
import { faRectangleXmark, faSquareCheck, faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NewTaskForm = ({ formMode, handleCancelClick, currentUser, addTaskTile, scrollToForm, editTaskData }) => {
  const [errors, setErrors] = useState({});
  const stringsForModes = {
    add: {
      addOrEdit: "Add a task",
      saveOrSubmit: "Submit",
      API_route: "/api/v1/tasks/new",
      API_method: "POST"
    },
    edit: {
      addOrEdit: `Edit task "${editTaskData?.name}"`,
      saveOrSubmit: "Save"
    }
  }
  const modeStrings = stringsForModes[formMode];
  const [formData, setFormData] = useState({});
  const [startDate, setStartDate] = useState(null);

  useEffect(() => {
    scrollToForm();
    if (formMode === "edit") {
      setFormData({
        name: editTaskData.name,
        description: editTaskData.description || "",
        startDate: new Date(editTaskData.startDate),
        interval: editTaskData.interval
      });
      setStartDate(new Date(editTaskData.startDate));
    }
  }, []);

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.currentTarget.name]: event.currentTarget.value
    });
  }

  const handleDateChange = (date) => {
    setStartDate(date);
    const dateString = date.toLocaleDateString("en-US");
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

  const addTask = async (formData) => {
    const newTask = { ...formData, userId: parseInt(currentUser.id) };
    try {
      const response = await fetch(modeStrings.API_route, {
        method: modeStrings.API_method,
        headers: new Headers({
          "Content-Type": "application/json"
        }),
        body: JSON.stringify({ newTask })
      });
      if (!response.ok) {
        if (response.status === 422) {
          const errorBody = await response.json()
          const newErrors = translateServerErrors(errorBody.errors);
          return setErrors(newErrors);
        }
        throw new Error(`${response.status} ${response.statusText}`);
      } else {
        const { addedTask } = await response.json();
        addTaskTile(addedTask);
        return true;
      }
    } catch (error) {
      console.error(`Fetch post error: ${error.name} ${error.message}`);
    }
  }

  return (
    <>
      <h3 className="header">{modeStrings.addOrEdit}</h3>
      <ErrorList errors={errors} />
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" onChange={handleInputChange} value={formData.name || ""} />

        <input type="text" name="description" placeholder="Description" onChange={handleInputChange} value={formData.description || ""}/>

        <div className="start-date-interval-container">
          <div className="start-date-container">
            <DatePicker selected={startDate || null} placeholderText={"Start date"} onChange={(date) => handleDateChange(date)} />
          </div>
          <div className="interval-container">
            <input type="number" name="interval" placeholder="Interval (days)" onChange={handleInputChange} value={formData.interval || ""}/>
          </div>
        </div>

        <div className="form-buttons-bottom">
          <button type="button" className="button" onClick={handleCancelClick}>
            <FontAwesomeIcon icon={faRectangleXmark} />
            &nbsp;Cancel
          </button>
          <button type="submit" className="button">
            <FontAwesomeIcon icon={faSquareCheck} />
            &nbsp;{modeStrings.saveOrSubmit}</button>
        </div>
      </form>
    </>
  )
}

export default NewTaskForm;