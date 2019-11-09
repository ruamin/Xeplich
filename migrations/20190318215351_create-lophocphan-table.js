exports.up = function (knex, Promise) {
  return knex.schema.createTable('lophocphan', function (table) {
    table.increments()
    table.string('malophocphan')
    table.integer('idmonhoc').unsigned()
    table.integer('idgiangduong').unsigned()
    table.integer('idkyhoc').unsigned()
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('lophocphan')
}
