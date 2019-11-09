exports.up = function (knex, Promise) {
  return knex.schema.createTable('account', function (table) {
    table.increments()
    table.string('username')
    table.string('password')
    table.string('fullName')
    table.integer('role')
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('account')
}
