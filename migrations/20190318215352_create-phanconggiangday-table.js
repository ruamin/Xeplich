exports.up = function (knex, Promise) {
  return knex.schema.createTable('phanconggiangday', function (table) {
    table.increments()
    table.integer('idlophocphan').unsigned().references('id').inTable('lophocphan')
    table.integer('idgiangvien').unsigned().references('id').inTable('giangvien')
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('phanconggiangday')
}
