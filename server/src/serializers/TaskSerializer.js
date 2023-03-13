import { Task } from "../models/index.js";

class TaskSerializer {
  static getSummary(task) {
    const allowedAttributes = ["id", "name", "description", "image", "startDate", "endDate", "interval", "deleted"];

    let serializedTask = {};
    for (const attribute of allowedAttributes) {
      serializedTask[attribute] = task[attribute];
    }
    serializedTask.startDate = new Date(serializedTask.startDate);

    return serializedTask;
  }

  static getSummaries(tasks) {
    return tasks.map(task => TaskSerializer.getSummary(task));
  }
}

export default TaskSerializer;