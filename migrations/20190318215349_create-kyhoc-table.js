exports.up = function (knex, Promise) {
  return knex.schema.createTable('kyhoc', function (table) {
    table.increments()
    table.date('batdau')
    table.date('ketthuc')
    table.string('name')
    table.boolean('lakyphu')
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('kyhoc')
}
