import express from "express";

import { TaskCompletion } from "../../../models/index.js";

const taskCompletionsRouter = new express.Router();

taskCompletionsRouter.post("/complete", async (req, res) => {
  const { id, forDate } = req.body;

  try {
    const addedTaskCompletion = await TaskCompletion.query().insertAndFetch({ taskId: id, date: forDate })
    return res.status(201).json({ addedTaskCompletion })
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(422).json({ errors: error.data })
    }
    return res.status(500).json({ errors: error })
  }
});

taskCompletionsRouter.post("/uncomplete", async (req, res) => {
  const { id, forDate } = req.body;

  try {
    const taskCompletionToDelete = (await TaskCompletion.query().where("taskId", id).where("date", forDate))[0];
    await TaskCompletion.query().deleteById(parseInt(taskCompletionToDelete.id));

    return res.status(204).json({message: "deleted completion"});
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(401).json({ errors: error.data })
    }
    return res.status(500).json({ errors: error })
  }
});

export default taskCompletionsRouter;