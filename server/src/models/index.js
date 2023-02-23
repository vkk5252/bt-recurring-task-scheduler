// include all of your models here using CommonJS requires
const User = require("./User.js");
const Task = require("./Task.js");
const TaskCompletion = require("./TaskCompletion.js");

module.exports = { User, Task, TaskCompletion };