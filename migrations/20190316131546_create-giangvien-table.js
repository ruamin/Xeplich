
exports.up = function (knex, Promise) {
  return knex.schema.createTable('giangvien', function (table) {
    table.increments('id').primary()
    table.string('name')
    table.string('capbac')
    table.string('hocvi')
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('giangvien')
}
