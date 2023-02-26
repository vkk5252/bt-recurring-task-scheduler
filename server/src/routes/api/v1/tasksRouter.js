import express from "express";
import Objection from "objection";
const { ValidationError } = Objection;

import cleanUserInput from "../../../services/cleanUserInput.js";
import uploadImage from "../../../services/uploadImage.js";

import { User, Task, TaskCompletion } from "../../../models/index.js";
import TaskSerializer from "../../../serializers/TaskSerializer.js";

const tasksRouter = new express.Router();

tasksRouter.get("/all", async (req, res) => {
  const currentUserId = req.user?.id;

  try {
    const currentUser = await User.query().findById(currentUserId);
    const tasks = await currentUser.$relatedQuery("tasks");
    const serializedTasks = TaskSerializer.getSummaries(tasks);
    return res.status(200).json({ tasks: serializedTasks });
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
});

tasksRouter.get("/:dateString", async (req, res) => {
  const { dateString } = req.params;
  const date = new Date(dateString);
  const currentUserId = req.user?.id;

  try {
    const currentUser = await User.query().findById(currentUserId);
    const tasks = await currentUser.$relatedQuery("tasks");
    const serializedTasks = TaskSerializer.getSummaries(tasks);
    const filteredTasks = TaskSerializer.filterTasksForDate(serializedTasks, date);
    return res.status(200).json({ tasks: filteredTasks });
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
});

tasksRouter.post("/new", uploadImage.single("image"), async (req, res) => {
  try {
    const { body } = req;
    const newTask = {
      ...body,
      image: req.file?.location,
    }
    const cleanedNewTask = cleanUserInput(newTask);

    const addedTask = await Task.query().insertAndFetch(cleanedNewTask);
    
    return res.status(201).json({ addedTask });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(422).json({ errors: error.data });
    }
    return res.status(500).json({ errors: error });
  }
});

tasksRouter.put("/edit", uploadImage.single("image"), async (req, res) => {
  try {
    const { body } = req;
    const editedTask = {
      ...body,
      image: req.file?.location || null,
    }
    const { taskId } = editedTask;
    delete editedTask.taskId;
    const cleanedEditedTask = cleanUserInput(editedTask);

    console.log(cleanedEditedTask);

    if (!cleanedEditedTask.description) {
      cleanedEditedTask.description = "";
    }

    const updatedTask = await Task.query().updateAndFetchById(parseInt(taskId), cleanedEditedTask);
    return res.status(201).json({ updatedTask })
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(422).json({ errors: error.data })
    }
    return res.status(500).json({ errors: error })
  }
});

tasksRouter.post("/complete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const currentDate = (new Date()).toLocaleDateString("en-us");
    const addedTaskCompletion = await Task.query().insertAndFetch({ taskId: id, date: currentDate })
    return res.status(201).json({ addedTaskCompletion })
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(422).json({ errors: error.data })
    }
    return res.status(500).json({ errors: error })
  }
});

tasksRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const tasks = await Task.query().deleteById(id);
    return res.status(204).json({ message: "task deleted successfully" });
  } catch (error) {
    return res.status(401).json({ errors: error });
  }
});

export default tasksRouter;