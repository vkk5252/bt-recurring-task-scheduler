import React, { useState, useEffect } from "react";

import ErrorList from "./layout/ErrorList.js";
import translateServerErrors from "../services/translateServerErrors.js";

import DatePicker from "react-datepicker";
import Dropzone from "react-dropzone"
import { faRectangleXmark, faSquareCheck, faImage } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NewTaskForm = ({ formMode, closeForm, currentUser, addTaskTile, editTaskTile, scrollToForm, editTaskData }) => {
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
  const [formData, setFormData] = useState({ userId: currentUser.id });
  const [startDate, setStartDate] = useState(null);
  const [path, setPath] = useState(null);

  useEffect(() => {
    scrollToForm();
    if (formMode === "edit") {
      setFormData({
        ...formData,
        taskId: editTaskData.id,
        name: editTaskData.name,
        description: editTaskData.description || "",
        startDate: new Date(editTaskData.startDate),
        interval: editTaskData.interval
      });
      setStartDate(new Date(editTaskData.startDate));
      setPath(editTaskData.image);
    }
  }, []);

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.currentTarget.name]: event.currentTarget.value
    });
    scrollToForm();
  }

  const handleImageUpload = (acceptedImage) => {
    setFormData({
      ...formData,
      image: acceptedImage[0]
    });
    setPath(URL.createObjectURL(acceptedImage[0]));
  }

  const handleDateChange = (date) => {
    setStartDate(date);
    const dateString = date.toLocaleDateString("en-US");
    setFormData({
      ...formData,
      startDate: dateString
    });
  }

  const removeImage = (event) => {
    setPath(null);
    const newFormData = {...formData};
    delete newFormData.image;
    setFormData(newFormData);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    switch (formMode) {
      case "add":
        if (await addTask(formData)) {
          closeForm();
        }
        break;
      case "edit":
        if (await editTask(formData)) {
          closeForm();
        }
    }
  }

  const addTask = async (formData) => {
    const newTaskBody = new FormData();
    for (const field in formData) {
      newTaskBody.append(field, formData[field]);
    }

    try {
      const response = await fetch("/api/v1/tasks/new", {
        method: "POST",
        headers: new Headers({
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
    const editTaskBody = new FormData();

    for (const field in formData) {
      editTaskBody.append(field, formData[field]);
    }
    if (path) {
      editTaskBody.append("image", path);
    }

    try {
      const response = await fetch("/api/v1/tasks/edit", {
        method: "PUT",
        headers: new Headers({
          "Accept": "image/jpeg"
        }),
        body: editTaskBody
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

  let imageComponent;
  if (path) {
    imageComponent = (
      <>
        <button type="button" className="button" onClick={removeImage}>Remove image</button>
        <img key={path} src={path} />
      </>
    );
  } else {
    imageComponent = (
      <Dropzone onDrop={handleImageUpload}>
        {({ getRootProps, getInputProps }) => (
          <button className="button" type="button" {...getRootProps()}>
            Click here to add an image
            <input {...getInputProps()} />
          </button>
        )}
      </Dropzone>
    );
  }

  return (
    <>
      <h3 className="header">{modeStrings.addOrEdit}</h3>
      <ErrorList errors={errors} />
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" onChange={handleInputChange} value={formData.name || ""} />

        <input type="text" name="description" placeholder="Description" onChange={handleInputChange} value={formData.description || ""} />

        <div className="image-input">
          {imageComponent}
        </div>

        <div className="start-date-interval-container">
          <div className="start-date-container">
            <DatePicker selected={startDate || null} placeholderText={"Start date"} onChange={(date) => handleDateChange(date)} />
          </div>
          <div className="interval-container">
            <input type="number" name="interval" placeholder="Interval (days)" onChange={handleInputChange} value={formData.interval || ""} />
          </div>
        </div>

        <div className="form-buttons-bottom">
          <button type="button" className="button" onClick={closeForm}>
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