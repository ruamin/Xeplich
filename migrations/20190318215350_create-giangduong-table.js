exports.up = function (knex, Promise) {
  return knex.schema.createTable('giangduong', function (table) {
    table.increments('id').primary()
    table.string('toanha')
    table.string('tenphong')
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('giangduong')
}
