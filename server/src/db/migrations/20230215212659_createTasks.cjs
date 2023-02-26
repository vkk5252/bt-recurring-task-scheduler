/**
 * @typedef {import("knex")} Knex
 */

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
  return knex.schema.createTable("tasks", (table) => {
    table.bigIncrements("id");
    table.bigInteger("userId")
      .unsigned()
      .index()
      .references("users.id");
    table.string("name").notNullable();
    table.text("description");
    table.string("image");
    table.string("startDate").notNullable();
    table.string("endDate");
    table.integer("interval").unsigned().notNullable();
    table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now());
  });
}

/**
 * @param {Knex} knex
 */
exports.down = (knex) => {
  return knex.schema.dropTableIfExists("tasks");
}
