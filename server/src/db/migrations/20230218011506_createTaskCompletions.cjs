/**
 * @typedef {import("knex")} Knex
 */

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
  return knex.schema.createTable("task_completions", (table) => {
    table.bigIncrements("id");
    table.string("date").notNullable();
    table.bigInteger("taskId")
      .unsigned()
      .index()
      .references("tasks.id");
    table.timestamp("createdAt").defaultTo(knex.fn.now());
    table.timestamp("updatedAt").defaultTo(knex.fn.now());
  });
}

/**
 * @param {Knex} knex
 */
exports.down = (knex) => {
  return knex.schema.dropTableIfExists("task_completions");
}
