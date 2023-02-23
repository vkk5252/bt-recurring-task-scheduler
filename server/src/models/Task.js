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
      taskCompletion: {
        relation: Model.HasManyRelation,
        modelClass: TaskCompletion,
        join: {
          from: "tasks.id",
          to: "taskCompletions.taskId"
        }
      }
    };
  }
}

module.exports = Task;