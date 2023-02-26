import React, { useState, useEffect } from "react";

import ErrorList from "./layout/ErrorList.js";
import translateServerErrors from "../services/translateServerErrors.js";

import DatePicker from "react-datepicker";
import Dropzone from "react-dropzone"
import { faRectangleXmark, faSquareCheck } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NewTaskForm = ({ formMode, handleCancelClick, currentUser, addTaskTile, editTaskTile, scrollToForm, editTaskData }) => {
  const [errors, setErrors] = useState({});
  const stringsForModes = {
    add: {
      addOrEdit: "Add a task",
      saveOrSubmit: "Submit"
    },
    edit: {
      addOrEdit: `Edit task "${editTaskData?.name}"`,
      saveOrSubmit: "Save"
    }
  }
  const modeStrings = stringsForModes[formMode];
  const [formData, setFormData] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [path, setPath] = useState([]);

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

  const handleImageUpload = (acceptedImage) => {
    setFormData({
      ...formData,
      image: acceptedImage[0]
    });
    setPath(acceptedImage.map(file => URL.createObjectURL(file)));
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
    switch (formMode) {
      case "add":
        if (await addTask(formData)) {
          handleCancelClick();
        }
        break;
      case "edit":
        if (await editTask(formData)) {
          handleCancelClick();
        }
    }
  }

  const addTask = async (formData) => {
    // const newTask = { ...formData, userId: parseInt(currentUser.id) };

    const newTaskBody = new FormData();
    newTaskBody.append("userId", parseInt(currentUser.id));
    newTaskBody.append("name", formData.name);
    newTaskBody.append("description", formData.description);
    newTaskBody.append("image", formData.image);
    newTaskBody.append("startDate", formData.startDate);
    newTaskBody.append("interval", formData.interval);

    try {
      const response = await fetch("/api/v1/tasks/new", {
        method: "POST",
        headers: new Headers({
          // "Content-Type": "application/json",
          "Accept": "image/jpeg"
        }),
        body: newTaskBody
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

  const editTask = async (formData) => {
    const editedTask = { ...formData, userId: parseInt(currentUser.id) };
    try {
      const response = await fetch("/api/v1/tasks/edit", {
        method: "PUT",
        headers: new Headers({
          "Content-Type": "application/json"
        }),
        body: JSON.stringify({ taskId: editTaskData.id, editedTask: editedTask })
      });
      if (!response.ok) {
        if (response.status === 422) {
          const errorBody = await response.json()
          const newErrors = translateServerErrors(errorBody.errors);
          return setErrors(newErrors);
        }
        throw new Error(`${response.status} ${response.statusText}`);
      } else {
        const { updatedTask } = await response.json();
        editTaskTile(updatedTask);
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

        <input type="text" name="description" placeholder="Description" onChange={handleInputChange} value={formData.description || ""} />

        <Dropzone onDrop={handleImageUpload}>
          {({ getRootProps, getInputProps }) => (
            <section>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <p>Upload Your Meme - drag 'n' drop or click to upload</p>
              </div>
            </section>
          )}
        </Dropzone>
        {path.map(path => <img key={path} src={path} />)}

        <div className="start-date-interval-container">
          <div className="start-date-container">
            <DatePicker selected={startDate || null} placeholderText={"Start date"} onChange={(date) => handleDateChange(date)} />
          </div>
          <div className="interval-container">
            <input type="number" name="interval" placeholder="Interval (days)" onChange={handleInputChange} value={formData.interval || ""} />
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