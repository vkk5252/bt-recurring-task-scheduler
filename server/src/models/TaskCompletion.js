const Model = require("./Model.js");

class TaskCompletion extends Model {
  static get tableName() {
    return "task_completions";
  }

  static get relationMappings() {
    const { Task } = require("./index.js");

    return {
      task: {
        relation: Model.BelongsToOneRelation,
        modelClass: Task,
        join: {
          from: "task_completions.taskId",
          to: "tasks.id"
        }
      }
    };
  }
}

module.exports = TaskCompletion;