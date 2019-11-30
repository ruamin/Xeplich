exports.up = function(knex, Promise) {
  return knex.schema.createTable("thoikhoabieu", function(table) {
    table.increments();
    table
      .integer("idlophocphan")
      .unsigned()
      .references("id")
      .inTable("lophocphan");
    table
      .integer("idgiangvien")
      .unsigned()
      .references("id")
      .inTable("giangvien");
    table
      .integer("idkyhoc")
      .unsigned()
      .references("id")
      .inTable("kyhoc");
    table
      .integer("idgiangduong")
      .unsigned()
      .references("id")
      .inTable("giangduong");
    table.integer("thu").unsigned();
    table.integer("tiet").unsigned();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("phanconggiangday");
};
