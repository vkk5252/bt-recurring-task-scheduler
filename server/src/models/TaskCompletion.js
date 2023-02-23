const Model = require("./Model.js");

class TaskCompletion extends Model {
  static get tableName() {
    return "taskCompletions";
  }

  static get relationMappings() {
    const { Task } = require("./index.js");

    return {
      task: {
        relation: Model.BelongsToOneRelation,
        modelClass: Task,
        join: {
          from: "taskCompletions.taskId",
          to: "tasks.id"
        }
      }
    };
  }
}

module.exports = TaskCompletion;