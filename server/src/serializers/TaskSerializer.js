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

  static filterTasksForDate(tasks, currentDate) {
    return tasks.filter(task => {
      const datesMillisecondsDifference = currentDate - task.startDate;
      const datesDaysDifference = Math.floor(datesMillisecondsDifference / (1000 * 60 * 60 * 24));
      
      return datesDaysDifference >= 0 ? !(datesDaysDifference % task.interval) : false;
    })
  }

  static async addCompletedForTodayProperty(task, dateString) {
    const taskRecord = await Task.query().findById(task.id);
    const completions = await taskRecord.$relatedQuery("completions");
    const completedForToday = !!completions.find(completion => completion.date === dateString.replaceAll("-", "/"));

    return { ...task, completedForToday: completedForToday };
  }
}

export default TaskSerializer;