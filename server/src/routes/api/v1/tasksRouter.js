import express from "express";
import Objection from "objection";
const { ValidationError } = Objection;

import cleanUserInput from "../../../services/cleanUserInput.js";
import uploadImage from "../../../services/uploadImage.js";

import { User, Task } from "../../../models/index.js";
import TaskSerializer from "../../../serializers/TaskSerializer.js";
import taskCompletionsRouter from "./taskCompletionsRouter.js";

const tasksRouter = new express.Router();

tasksRouter.get("/all", async (req, res) => {
  const currentUserId = req.user?.id;

  try {
    const currentUser = await User.query().findById(currentUserId);
    const tasks = await currentUser.$relatedQuery("tasks");
    const serializedTasks = TaskSerializer.getSummaries(tasks);
    const serializedNonDeletedTasks = serializedTasks.filter(task => !task.deleted);
    return res.status(200).json({ tasks: serializedNonDeletedTasks });
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
    const nonDeletedTasks = serializedTasks.filter(task => !task.deleted);
    const filteredTasks = Task.filterTasksForDate(nonDeletedTasks, date);
    const filteredTasksWithCompletions = await Promise.all(filteredTasks.map(task => Task.addCompletedForTodayProperty(task, dateString)));

    return res.status(200).json({ tasks: filteredTasksWithCompletions });
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
    console.log(body);
    const editedTask = {
      ...body,
      image: req.file?.location || body.image || null,
    }

    console.log(editedTask);
    const { taskId } = editedTask;
    delete editedTask.taskId;
    const cleanedEditedTask = cleanUserInput(editedTask);
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

tasksRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const tasks = await Task.query().findById(id).patch({deleted: true});
    return res.status(204).json({ message: "task deleted successfully" });
  } catch (error) {
    return res.status(401).json({ errors: error });
  }
});

tasksRouter.use("/mark", taskCompletionsRouter);

export default tasksRouter;