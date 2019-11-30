exports.up = function(knex, Promise) {
  return knex.schema.createTable("lophocphan", function(table) {
    table.increments("id").primary();
    table.string("malophocphan");
    table.integer("sosinhvien");
    table
      .integer("idmonhoc")
      .unsigned()
      .references("id")
      .inTable("monhoc");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("lophocphan");
};
