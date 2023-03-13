const Model = require("./Model.js");

class Task extends Model {
  static get tableName() {
    return "tasks";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name", "startDate", "interval"],
      properties: {
        name: { type: "string" },
        startDate: { type: "string" },
        interval: { type: ["integer", "string"] },
        description: { type: "string"}
      }
    };
  }

  static get relationMappings() {
    const { User, TaskCompletion } = require("./index.js");

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "tasks.userId",
          to: "users.id"
        }
      },
      completions: {
        relation: Model.HasManyRelation,
        modelClass: TaskCompletion,
        join: {
          from: "tasks.id",
          to: "task_completions.taskId"
        }
      }
    };
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

module.exports = Task;